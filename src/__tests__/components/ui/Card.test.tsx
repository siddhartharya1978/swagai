import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card', () => {
  it('renders card with all parts', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card Content')).toBeInTheDocument();
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('renders card with custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    const card = screen.getByText('Content').closest('div');
    expect(card).toHaveClass('custom-class');
  });

  it('renders card header with custom className', () => {
    render(
      <Card>
        <CardHeader className="custom-header">Header</CardHeader>
      </Card>
    );
    const header = screen.getByText('Header').closest('div');
    expect(header).toHaveClass('custom-header');
  });

  it('renders card title with custom className', () => {
    render(<CardTitle className="custom-title">Title</CardTitle>);
    expect(screen.getByText('Title')).toHaveClass('custom-title');
  });

  it('renders card description with custom className', () => {
    render(<CardDescription className="custom-description">Description</CardDescription>);
    expect(screen.getByText('Description')).toHaveClass('custom-description');
  });

  it('renders card content with custom className', () => {
    render(
      <Card>
        <CardContent className="custom-content">Content</CardContent>
      </Card>
    );
    const content = screen.getByText('Content').closest('div');
    expect(content).toHaveClass('custom-content');
  });

  it('renders card footer with custom className', () => {
    render(
      <Card>
        <CardFooter className="custom-footer">Footer</CardFooter>
      </Card>
    );
    const footer = screen.getByText('Footer').closest('div');
    expect(footer).toHaveClass('custom-footer');
  });

  it('renders card with only required parts', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders card with header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders card with content and footer', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders card with title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
}); 