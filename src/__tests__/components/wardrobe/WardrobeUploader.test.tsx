import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WardrobeUploader } from '@/components/wardrobe/WardrobeUploader';
import { useAuth } from '@/components/auth/AuthProvider';
import { uploadWardrobeItem } from '@/lib/api/wardrobe';
import { useDropzone } from 'react-dropzone';

// Mock the hooks and API functions
jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api/wardrobe', () => ({
  uploadWardrobeItem: jest.fn(),
}));

jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(),
}));

describe('WardrobeUploader', () => {
  const mockOnUpload = jest.fn();
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockInvalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user1' } });
    (uploadWardrobeItem as jest.Mock).mockResolvedValue({ data: {}, error: null, duplicate: false });
    (useDropzone as jest.Mock).mockReturnValue({
      getRootProps: jest.fn(() => ({})),
      getInputProps: jest.fn(() => ({})),
      isDragActive: false,
    });
  });

  it('renders upload area', () => {
    render(<WardrobeUploader onUpload={mockOnUpload} />);
    expect(screen.getByText(/drag & drop your image here/i)).toBeInTheDocument();
  });

  it('handles valid image file upload', async () => {
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(mockFile);
    });
  });

  it('handles invalid file type', async () => {
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockInvalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/please upload an image file/i)).toBeInTheDocument();
    });
  });

  it('shows upload progress', async () => {
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText('test.jpg')).toBeInTheDocument();
    });
  });

  it('handles successful upload', async () => {
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const startUploadButton = screen.getByText(/start uploads/i);
    fireEvent.click(startUploadButton);

    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
    });
  });

  it('handles duplicate item', async () => {
    (uploadWardrobeItem as jest.Mock).mockResolvedValue({ data: {}, error: null, duplicate: true });
    
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const startUploadButton = screen.getByText(/start uploads/i);
    fireEvent.click(startUploadButton);

    await waitFor(() => {
      expect(screen.getByText(/duplicate item/i)).toBeInTheDocument();
    });
  });

  it('handles upload error', async () => {
    (uploadWardrobeItem as jest.Mock).mockRejectedValue(new Error('Upload failed'));
    
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const startUploadButton = screen.getByText(/start uploads/i);
    fireEvent.click(startUploadButton);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  it('handles cancel upload', async () => {
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const startUploadButton = screen.getByText(/start uploads/i);
    fireEvent.click(startUploadButton);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/canceled/i)).toBeInTheDocument();
    });
  });

  it('handles remove uploaded item', async () => {
    const { getRootProps } = useDropzone();
    (getRootProps as jest.Mock).mockReturnValue({
      onClick: jest.fn(),
      onDrop: jest.fn(),
    });

    render(<WardrobeUploader onUpload={mockOnUpload} />);
    
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const startUploadButton = screen.getByText(/start uploads/i);
    fireEvent.click(startUploadButton);

    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.jpg')).not.toBeInTheDocument();
    });
  });
}); 