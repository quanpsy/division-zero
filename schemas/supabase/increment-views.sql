-- Run this in Supabase SQL Editor to create the view increment function

-- Function to increment project views
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET views = COALESCE(views, 0) + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION increment_project_views TO anon;
