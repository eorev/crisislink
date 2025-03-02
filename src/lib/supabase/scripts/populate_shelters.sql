
-- Populate shelters table with more varied data
-- This script assumes you're using the schema.sql structure

-- Get a user_id for association (you'll need to replace this with a valid user_id from your auth.users table)
-- In a real execution, you would replace 'your-user-id-here' with an actual UUID from your auth.users table
DO $$
DECLARE
  user_id UUID := (SELECT id FROM auth.users LIMIT 1);
BEGIN

-- Only proceed if we found a valid user
IF user_id IS NOT NULL THEN

  -- Delete existing data for clean slate (comment this out if you want to keep existing data)
  DELETE FROM resources WHERE user_id = user_id;
  DELETE FROM shelters WHERE user_id = user_id;

  -- Insert varied shelter data
  -- California shelters
  INSERT INTO shelters (name, address, capacity, current_occupancy, contact_phone, status, last_updated, user_id)
  VALUES 
    ('Golden Gate Relief Center', '123 Market St, San Francisco, CA 94111', 350, 187, '(415) 555-1234', 'operational', NOW(), user_id),
    ('Oakland Community Shelter', '456 Broadway, Oakland, CA 94607', 275, 258, '(510) 555-2345', 'limited', NOW(), user_id),
    ('Silicon Valley Emergency Hub', '789 Tech Blvd, San Jose, CA 95110', 400, 156, '(408) 555-3456', 'operational', NOW(), user_id),
    ('Sacramento Capital Shelter', '321 Capitol Mall, Sacramento, CA 95814', 300, 124, '(916) 555-4567', 'operational', NOW(), user_id),
    ('LA Convention Center', '1201 S Figueroa St, Los Angeles, CA 90015', 800, 612, '(213) 555-5678', 'operational', NOW(), user_id),
    ('San Diego Bayfront Shelter', '111 Harbor Dr, San Diego, CA 92101', 450, 422, '(619) 555-6789', 'limited', NOW(), user_id),
    ('Fresno Fairgrounds', '1121 S Chance Ave, Fresno, CA 93702', 500, 231, '(559) 555-7890', 'operational', NOW(), user_id);

  -- Texas shelters
  INSERT INTO shelters (name, address, capacity, current_occupancy, contact_phone, status, last_updated, user_id)
  VALUES 
    ('Houston Astrodome Shelter', '8400 Kirby Dr, Houston, TX 77054', 1000, 876, '(713) 555-2222', 'operational', NOW(), user_id),
    ('Dallas Convention Center', '650 S Griffin St, Dallas, TX 75202', 750, 487, '(214) 555-3333', 'operational', NOW(), user_id),
    ('Austin Community College', '5930 Middle Fiskville Rd, Austin, TX 78752', 350, 189, '(512) 555-4444', 'limited', NOW(), user_id),
    ('San Antonio Alamodome', '100 Montana St, San Antonio, TX 78203', 850, 432, '(210) 555-5555', 'operational', NOW(), user_id);

  -- Florida shelters
  INSERT INTO shelters (name, address, capacity, current_occupancy, contact_phone, status, last_updated, user_id)
  VALUES 
    ('Miami-Dade Hurricane Center', '8300 NW 33rd St, Miami, FL 33122', 650, 432, '(305) 555-6666', 'operational', NOW(), user_id),
    ('Orlando Convention Center', '9800 International Dr, Orlando, FL 32819', 700, 543, '(407) 555-7777', 'operational', NOW(), user_id),
    ('Tampa Bay Arena', '401 Channelside Dr, Tampa, FL 33602', 550, 476, '(813) 555-8888', 'limited', NOW(), user_id),
    ('Jacksonville Evacuation Center', '300 A Philip Randolph Blvd, Jacksonville, FL 32202', 400, 156, '(904) 555-9999', 'closed', NOW(), user_id);

  -- New York shelters
  INSERT INTO shelters (name, address, capacity, current_occupancy, contact_phone, status, last_updated, user_id)
  VALUES 
    ('NYC Emergency Armory', '643 Park Ave, New York, NY 10065', 500, 467, '(212) 555-1010', 'operational', NOW(), user_id),
    ('Brooklyn Tech High School', '29 Fort Greene Pl, Brooklyn, NY 11217', 450, 322, '(718) 555-1111', 'operational', NOW(), user_id),
    ('Queens College Shelter', '65-30 Kissena Blvd, Queens, NY 11367', 350, 287, '(718) 555-1212', 'limited', NOW(), user_id),
    ('Bronx Community Center', '1500 Pelham Pkwy S, Bronx, NY 10461', 300, 143, '(718) 555-1313', 'operational', NOW(), user_id);

  -- Other states shelters
  INSERT INTO shelters (name, address, capacity, current_occupancy, contact_phone, status, last_updated, user_id)
  VALUES 
    ('Chicago Willis Tower Shelter', '233 S Wacker Dr, Chicago, IL 60606', 500, 322, '(312) 555-1414', 'operational', NOW(), user_id),
    ('Seattle Emergency Center', '305 Harrison St, Seattle, WA 98109', 400, 267, '(206) 555-1515', 'operational', NOW(), user_id),
    ('Denver Convention Center', '700 14th St, Denver, CO 80202', 550, 321, '(303) 555-1616', 'limited', NOW(), user_id),
    ('Las Vegas Arena Relief', '3780 S Las Vegas Blvd, Las Vegas, NV 89158', 750, 345, '(702) 555-1717', 'operational', NOW(), user_id),
    ('New Orleans Superdome', '1500 Sugar Bowl Dr, New Orleans, LA 70112', 900, 654, '(504) 555-1818', 'operational', NOW(), user_id),
    ('Portland Community College', '12000 SW 49th Ave, Portland, OR 97219', 300, 187, '(503) 555-1919', 'limited', NOW(), user_id),
    ('Phoenix Convention Center', '100 N 3rd St, Phoenix, AZ 85004', 600, 234, '(602) 555-2020', 'operational', NOW(), user_id),
    ('Atlanta Civic Center', '395 Piedmont Ave NE, Atlanta, GA 30308', 450, 321, '(404) 555-2121', 'operational', NOW(), user_id);

  -- Now add resources for each shelter
  -- Loop through shelters and add relevant resources
  FOR shelter_rec IN SELECT id, capacity FROM shelters WHERE user_id = user_id
  LOOP
    -- Food resources (meals)
    INSERT INTO resources (name, category, total_amount, unit, shelter_id, alert_threshold, last_updated, user_id)
    VALUES ('Food Supplies', 'Food', shelter_rec.capacity * 3, 'meals', shelter_rec.id, shelter_rec.capacity, NOW(), user_id);
    
    -- Water resources (gallons)
    INSERT INTO resources (name, category, total_amount, unit, shelter_id, alert_threshold, last_updated, user_id)
    VALUES ('Water Supplies', 'Water', shelter_rec.capacity * 2, 'gallons', shelter_rec.id, shelter_rec.capacity * 0.5, NOW(), user_id);
    
    -- Medical resources (kits)
    INSERT INTO resources (name, category, total_amount, unit, shelter_id, alert_threshold, last_updated, user_id)
    VALUES ('Medical Supplies', 'Medical', CEIL(shelter_rec.capacity * 0.2), 'kits', shelter_rec.id, CEIL(shelter_rec.capacity * 0.05), NOW(), user_id);
    
    -- Beds resources
    INSERT INTO resources (name, category, total_amount, unit, shelter_id, alert_threshold, last_updated, user_id)
    VALUES ('Beds', 'Beds', shelter_rec.capacity, 'units', shelter_rec.id, shelter_rec.capacity * 0.1, NOW(), user_id);
    
    -- Add power generators for some shelters (randomly)
    IF random() > 0.5 THEN
      INSERT INTO resources (name, category, total_amount, unit, shelter_id, alert_threshold, last_updated, user_id)
      VALUES ('Power Generators', 'Power', CEIL(shelter_rec.capacity / 100), 'units', shelter_rec.id, 1, NOW(), user_id);
    END IF;
    
    -- Add some other supplies for variety
    INSERT INTO resources (name, category, total_amount, unit, shelter_id, alert_threshold, last_updated, user_id)
    VALUES ('Hygiene Kits', 'Other', shelter_rec.capacity, 'kits', shelter_rec.id, shelter_rec.capacity * 0.3, NOW(), user_id);
  END LOOP;

  -- Output success message
  RAISE NOTICE 'Successfully populated shelters and resources for user %', user_id;
ELSE
  -- Output error if no user found
  RAISE EXCEPTION 'No user found in auth.users table. Please create a user first.';
END IF;

END $$;
