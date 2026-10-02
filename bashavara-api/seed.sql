-- =============================================================================
-- BashaVara Database Seed Data (Converted from public/data.json)
-- =============================================================================

USE `bashavara`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `reviews`;
TRUNCATE TABLE `requests`;
TRUNCATE TABLE `listing_amenities`;
TRUNCATE TABLE `listings`;
TRUNCATE TABLE `roommate_profiles`;
TRUNCATE TABLE `account`;
TRUNCATE TABLE `session`;
TRUNCATE TABLE `user`;
SET FOREIGN_KEY_CHECKS = 1;

-- ── 1. Users & Roommate Profiles ─────────────────────────────────────────────
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u0', 'Jordan Kim', 'jordan.kim@cs.mit.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u0', 1500, 'Computer Science', 'Night Owl', 'Non-Smoker', 'CS grad student at MIT. Looking for a quiet place close to campus. I work late hours but am respectful of shared spaces.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u1', 'Alex Chen', 'alex.chen@engineering.bu.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u1', 1400, 'Electrical Engineering', 'Night Owl', 'Non-Smoker', 'Second-year EE student. Into hackathons and late-night coding sessions. Looking for a like-minded roommate.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u2', 'Priya Sharma', 'priya.sharma@science.bu.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u2', 1200, 'Biochemistry', 'Early Bird', 'Non-Smoker', 'Pre-med student. Very clean and organized. Up by 6 AM for lab. Looking for a non-smoking, quiet environment.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u3', 'Marcus Johnson', 'marcus.j@arts.northeastern.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u3', 900, 'Fine Arts', 'Night Owl', 'Non-Smoker', 'MFA candidate. I paint and sculpt — I have my own studio space. Just need a place to sleep and recharge.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u4', 'Kavya Reddy', 'kavya.r@engineering.mit.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u4', 1600, 'Computer Science', 'Night Owl', 'Non-Smoker', 'CS PhD student working on ML research. Night owl but very quiet. Would love a fellow CS person to live with.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u5', 'Tyler Brooks', 'tyler.b@business.bu.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u5', 2000, 'Business Administration', 'Flexible', 'Non-Smoker', 'MBA student. Finance focus. I travel every other weekend. Clean, social but mindful of study hours.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u6', 'Amara Osei', 'amara.o@medicine.tufts.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u6', 1800, 'Medicine', 'Flexible', 'Non-Smoker', 'Med student at Tufts. Crazy schedule — sometimes home late, sometimes early. Non-negotiable: no smoking.');
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`) VALUES ('u7', 'Nadia Petrov', 'nadia.p@law.bc.edu', TRUE, 'student');
INSERT INTO `roommate_profiles` (`user_id`, `budget`, `department`, `sleep_schedule`, `smoking_preference`, `bio`) VALUES ('u7', 1700, 'Law', 'Early Bird', 'Non-Smoker', '2L at BC Law. Early bird, love to cook. Very tidy. Looking for someone responsible and considerate.');

-- Landlord User
INSERT INTO `user` (`id`, `name`, `email`, `emailVerified`, `role`, `phone`, `businessName`) VALUES ('ld0', 'Margaret Okafor', 'margaret@okaforproperties.com', TRUE, 'landlord', '+1 (617) 555-0192', 'Okafor Property Group');

-- ── 2. Listings & Listing Amenities ─────────────────────────────────────────
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('ld-l1', 'ld0', 'Sunlit 2BR Near Harvard Square', '15 Dunster St, Cambridge, MA 02138', 'Beautifully updated two-bedroom in a classic Cambridge brownstone. Both bedrooms fit a queen bed. Hardwood floors throughout, large windows, and a recently renovated kitchen with quartz countertops. Steps from Harvard Square red line stop. All utilities included.', 2400, 0, '0.6 mi', 2, 1, 'Any', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&auto=format', 'Aug 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l1', 'All utilities included');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l1', 'Hardwood floors');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l1', 'Updated kitchen');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l1', 'Red Line access');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l1', 'Bike storage');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l1', 'Laundry in building');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('ld-l2', 'ld0', 'Private Studio — Walk to Northeastern', '88 Forsyth St, Boston, MA 02115', 'Quiet, self-contained studio on the second floor of a well-maintained triple-decker. Perfect for a focused student. Private entrance, full kitchen, and a built-in desk nook. Landlord on-site for fast maintenance response.', 1350, 65, '0.4 mi', 1, 1, 'Engineering / Sciences / Business', 'https://images.unsplash.com/photo-1522708323590-d24dbb2b4e4f?w=800&h=500&fit=crop&auto=format', 'Jul 15, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l2', 'Private entrance');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l2', 'Built-in desk');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l2', 'Full kitchen');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l2', 'High-speed WiFi');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l2', 'Pet-friendly (small dogs)');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('ld-l3', 'ld0', 'Spacious 3BR — Ideal for Grad Student Group', '210 Beacon St, Somerville, MA 02143', 'Large Victorian three-bedroom with two full baths, a formal dining room, and a sun deck. Great for three grad students splitting costs. Off-street parking included. Easy Green Line commute.', 3300, 120, '1.1 mi', 3, 2, 'Any', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&auto=format', 'Sep 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l3', 'Off-street parking');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l3', 'Sun deck');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l3', 'Dishwasher');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l3', 'Two full baths');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l3', 'Formal dining room');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l3', 'Green Line access');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('ld-l4', 'ld0', 'Cozy 1BR in Allston — BU/BC Commute', '34 Brighton Ave, Allston, MA 02134', 'Charming one-bedroom on a quiet street in Allston. Renovated bathroom, new appliances, and plenty of closet space. Vibrant neighborhood with cafes, restaurants, and groceries within walking distance.', 1600, 80, '1.8 mi', 1, 1, 'Business / Law / Social Sciences', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format', 'Aug 15, 2025', 'rented');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l4', 'New appliances');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l4', 'Renovated bathroom');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l4', 'Storage unit');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l4', 'Grocery nearby');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('ld-l4', 'Bus access');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l1', 'u1', 'Sunny Studio Near MIT Campus', '45 Massachusetts Ave, Cambridge, MA', 'Bright studio apartment just a 4-minute walk from the Stata Center. Recently renovated with new appliances, hardwood floors, and in-unit laundry. Ideal for a graduate student who values proximity to campus above all.', 1250, 80, '0.3 mi', 1, 1, 'Computer Science / EECS', 'https://images.unsplash.com/photo-1639663742190-1b3dba2eebcf?auto=format&fit=crop&w=800&h=500&q=80', 'Aug 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l1', 'In-unit laundry');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l1', 'High-speed WiFi');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l1', 'Bike storage');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l1', 'A/C');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l2', 'u2', 'Modern 1BR in Fenway — Perfect for BU Students', '12 Peterborough St, Boston, MA', 'Spacious one-bedroom in the heart of Fenway. Floor-to-ceiling windows with great natural light. Walking distance to multiple BU stops on the Green Line. Building has a rooftop deck.', 1850, 120, '1.2 mi', 1, 1, 'Engineering / Sciences', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format', 'Sep 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l2', 'Rooftop deck');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l2', 'Gym');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l2', 'Doorman');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l2', 'Dishwasher');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l2', 'Pet-friendly');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l3', 'u3', 'Cozy Private Room in Shared Victorian', '78 St. Botolph St, Boston, MA', 'Private furnished room in a beautiful Victorian house shared with two other grad students. Huge common kitchen, two bathrooms, small yard. Utilities split evenly. Very chill, studious atmosphere.', 875, 60, '0.8 mi', 1, 2, 'Arts / Design / Humanities', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop&auto=format', 'Jul 15, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l3', 'Furnished');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l3', 'Backyard / yard');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l3', 'High-speed WiFi');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l3', 'Pet-friendly');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l4', 'u5', 'Spacious 2BR — Ideal for BU or Northeastern', '200 Brookline Ave, Boston, MA', 'Large two-bedroom apartment with an open-concept living area, updated kitchen, and great city views. Steps from the Longwood Medical Area and Fenway Park. Perfect to split between two students.', 2600, 150, '0.5 mi', 2, 2, 'Business / Law / Social Sciences', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&auto=format', 'Aug 15, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l4', 'A/C');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l4', 'Parking included');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l4', 'Gym');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l4', 'Dishwasher');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l4', 'Elevator');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l5', 'u7', 'Private Studio with Dedicated Parking', '88 Commonwealth Ave, Boston, MA', 'Quiet ground-floor studio with a private entrance and dedicated parking spot. Very close to BC Law and the Green Line B branch. Utilities included. No-smoking building.', 1400, 90, '1.5 mi', 1, 1, 'Law / Business', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop&auto=format', 'Aug 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l5', 'Parking included');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l5', 'All utilities included');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l5', 'Private entrance');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l5', 'Storage unit');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l6', 'u4', 'Renovated Loft in Central Square', '620 Massachusetts Ave, Cambridge, MA', 'Stunning open-plan loft in a renovated industrial building. Exposed brick, 12ft ceilings, and tons of workspace. Perfect for someone who works from home. Walking distance to both MIT and Harvard.', 2200, 100, '0.9 mi', 1, 1, 'Computer Science / Engineering', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop&auto=format', 'Sep 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l6', 'High-speed WiFi');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l6', 'Bike storage');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l6', 'Furnished');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l6', 'In-unit laundry');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l7', 'u3', 'Budget-Friendly Room — All Bills Included', '301 Huntington Ave, Boston, MA', 'Best value in the city. All utilities (electric, gas, WiFi) included in rent. Shared with one other student. Located on the Orange Line near Ruggles — easy commute to any campus.', 725, 0, '2.1 mi', 1, 1, 'Any', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop&auto=format', 'Immediately', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l7', 'All utilities included');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l7', 'Orange Line access');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l7', 'Common lounge');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l7', 'Laundry in building');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l8', 'u6', 'Luxury 1BR with Gym — Longwood Medical Area', '100 Fenway, Boston, MA', 'Premium apartment in a luxury high-rise directly across from Harvard Medical School and Brigham and Womens. Building amenities include concierge, rooftop pool, and a state-of-the-art gym.', 2850, 0, '0.4 mi', 1, 1, 'Medicine / Public Health', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&auto=format', 'Aug 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l8', 'Gym');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l8', 'Rooftop deck');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l8', 'Doorman');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l8', 'In-unit laundry');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l8', 'Elevator');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l8', 'All utilities included');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l9', 'u2', 'Victorian Triple Near Northeastern', '22 Hemenway St, Boston, MA', 'One of three bedrooms available in a well-maintained Victorian. Two other rooms occupied by NU grad students. Huge kitchen, living room, and sunlit reading nook. Very social but study-friendly.', 975, 70, '1 mi', 1, 1, 'Engineering / Sciences / Business', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=500&fit=crop&auto=format', 'Aug 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l9', 'Bike storage');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l9', 'High-speed WiFi');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l9', 'Pet-friendly');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l9', 'Laundry in building');
INSERT INTO `listings` (`id`, `landlord_id`, `title`, `address`, `description`, `rent`, `utility_charge`, `distance`, `bedrooms`, `bathrooms`, `department_relevance`, `photo_url`, `available_from`, `status`) VALUES ('l10', 'u1', 'Efficiency Apartment Near RISD / Brown', '40 Benefit St, Providence, RI', 'Compact and stylish efficiency apartment in the historic College Hill neighborhood. Perfect for RISD or Brown students. Lots of natural light, exposed wood beams, and a murphy bed to maximize space.', 1100, 75, '1.3 mi', 1, 1, 'Design / Fine Arts', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop&auto=format', 'Sep 1, 2025', 'active');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l10', 'Furnished');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l10', 'High-speed WiFi');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l10', 'Heating included');
INSERT INTO `listing_amenities` (`listing_id`, `amenity`) VALUES ('l10', 'Private entrance');

-- ── 3. Reviews ─────────────────────────────────────────────────────────────
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r1', 'l1', 'u4', 5, 'Alex was a fantastic landlord rep. The apartment was exactly as described — spotless, bright, and incredibly close to Stata. Communication was great throughout the whole process.', '2025-05-20 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r2', 'l1', 'u7', 4, 'Great location and the unit is well-maintained. The in-unit laundry is a huge bonus. One star off because the hot water can be inconsistent during peak hours.', '2025-05-28 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r3', 'l2', 'u3', 5, 'One of the best apartments I have lived in as a student. The rooftop alone is worth it. Priya was very responsive and professional throughout.', '2025-06-01 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r4', 'l3', 'u5', 4, 'The house has so much character and the housemates Marcus found are great. The yard is a huge plus. Would prefer faster WiFi but everything else is perfect.', '2025-05-15 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r5', 'l6', 'u1', 5, 'The loft is insane — high ceilings, exposed brick, and so much desk space. Kavya was helpful and easy to work with. This place is a steal for Central Square.', '2025-06-08 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r6', 'l8', 'u2', 5, 'Worth every penny for a med student. The concierge handles packages, the gym is open 24/7, and being right across from Brigham saves me 20 minutes every morning.', '2025-06-18 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r7', 'l4', 'u6', 3, 'Good apartment but the price is steep. City views are real, kitchen is nice. Tyler was easy to deal with. Just not sure if the value is there compared to other options nearby.', '2025-06-10 00:00:00');
INSERT INTO `reviews` (`id`, `listing_id`, `reviewer_id`, `rating`, `comment`, `created_at`) VALUES ('r8', 'l7', 'u7', 5, 'Absolutely can not beat this deal. All bills included, nice housemate, and the Orange Line made my commute to BC Law easy. If you are on a tight budget, look no further.', '2025-05-30 00:00:00');

-- ── 4. Requests (Unified Student & Landlord Requests) ───────────────────────
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('lr1', 'u0', 'ld0', 'ld-l1', 'listing', 'pending', '2025-06-25 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('lr2', 'u4', 'ld0', 'ld-l1', 'listing', 'accepted', '2025-06-22 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('lr3', 'u2', 'ld0', 'ld-l2', 'listing', 'pending', '2025-06-26 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('lr4', 'u6', 'ld0', 'ld-l2', 'listing', 'rejected', '2025-06-20 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('lr5', 'u3', 'ld0', 'ld-l3', 'listing', 'pending', '2025-06-27 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('lr6', 'u7', 'ld0', 'ld-l3', 'listing', 'accepted', '2025-06-23 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('req1', 'u0', 'u1', 'l1', 'listing', 'pending', '2025-06-25 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('req2', 'u0', 'u4', NULL, 'roommate', 'accepted', '2025-06-20 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('req3', 'u0', 'u6', 'l8', 'listing', 'rejected', '2025-06-18 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('req4', 'u3', 'u0', NULL, 'roommate', 'pending', '2025-06-24 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('req5', 'u5', 'u0', 'l4', 'listing', 'accepted', '2025-06-21 00:00:00');
INSERT INTO `requests` (`id`, `sender_id`, `receiver_id`, `listing_id`, `type`, `status`, `created_at`) VALUES ('req6', 'u2', 'u0', NULL, 'roommate', 'pending', '2025-06-26 00:00:00');
