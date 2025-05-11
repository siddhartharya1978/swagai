-- Add outfit_data column to lookbook_items
ALTER TABLE lookbook_items
ADD COLUMN outfit_data JSONB;

-- Add is_positive column to outfit_feedback
ALTER TABLE outfit_feedback
ADD COLUMN is_positive BOOLEAN NOT NULL DEFAULT false;

-- Update existing lookbook_items to use outfit_data
UPDATE lookbook_items
SET outfit_data = jsonb_build_object(
  'outfit_name', outfit_name,
  'outfit_image_urls', outfit_image_urls,
  'notes', notes,
  'tags', tags
);

-- Drop old columns from lookbook_items
ALTER TABLE lookbook_items
DROP COLUMN outfit_name,
DROP COLUMN outfit_image_urls,
DROP COLUMN notes,
DROP COLUMN tags;

-- Update existing outfit_feedback to use is_positive
UPDATE outfit_feedback
SET is_positive = (feedback_type = 'positive');

-- Drop old column from outfit_feedback
ALTER TABLE outfit_feedback
DROP COLUMN feedback_type; 