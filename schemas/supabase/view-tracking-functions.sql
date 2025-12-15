-- ============================================
-- DIVISION ZERO - VIEW SLOT ROTATION FUNCTION
-- ============================================
-- Called by Cloudflare Worker every 6 hours
-- Rotates view slots for trending calculation
-- ============================================

-- Create function to rotate view slots
CREATE OR REPLACE FUNCTION rotate_view_slots()
RETURNS void AS $$
BEGIN
    -- Rotate slots: slot4 = slot3, slot3 = slot2, slot2 = slot1, slot1 = 0
    UPDATE projects
    SET 
        views_6h_slot4 = views_6h_slot3,
        views_6h_slot3 = views_6h_slot2,
        views_6h_slot2 = views_6h_slot1,
        views_6h_slot1 = 0,
        -- Update rolling periods
        views_3day = views_6h_slot1 + views_6h_slot2 + views_6h_slot3 + views_6h_slot4 + 
                     (views_3day - views_6h_slot4), -- Approximate 3-day
        updated_at = NOW()
    WHERE status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Increment view for a project
-- ============================================
-- Called when someone views a project
CREATE OR REPLACE FUNCTION increment_project_view(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects
    SET 
        views = views + 1,
        views_total = views_total + 1,
        views_6h_slot1 = views_6h_slot1 + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Increment click for a project
-- ============================================
CREATE OR REPLACE FUNCTION increment_project_click(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects
    SET clicks = clicks + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Increment save for a project
-- ============================================
CREATE OR REPLACE FUNCTION increment_project_save(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects
    SET saves = saves + 1
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE! View tracking functions ready.
-- ============================================
