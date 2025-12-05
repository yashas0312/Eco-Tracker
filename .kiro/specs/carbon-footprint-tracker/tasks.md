# Implementation Plan

- [x] 1. Set up backend data models and database schema



  - Create Entry model with schema for vehicle, plastic, energy, and plantation entries
  - Create User model with lifetime statistics tracking
  - Add database indexes for userId and date fields for query optimization
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 2.5, 8.1, 8.2_



- [ ] 2. Implement emission calculation services
  - [ ] 2.1 Create EmissionCalculator service class
    - Implement calculateVehicleEmissions method with fuel type factors (petrol, diesel, electric, hybrid, CNG)



    - Implement calculatePlasticEmissions method with plastic type factors
    - Implement calculateEnergyEmissions method with energy source factors and renewable flag
    - Implement calculateTreeOffset method with CO2 absorption and eco points calculation
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 3.4, 3.5, 6.2, 6.3, 7.2, 7.3, 7.4, 7.5_
  - [x] 2.2 Write unit tests for calculation accuracy


    - Test vehicle emissions for all fuel types with sample distances
    - Test plastic emissions for different quantities and types
    - Test energy emissions with renewable and non-renewable sources
    - Test tree offset calculations

    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [ ] 3. Create backend API endpoints for entry management
  - [x] 3.1 Implement POST /api/entries/vehicle endpoint

    - Accept distance, fuelType, date, and description
    - Calculate emissions using EmissionCalculator
    - Save entry to database and update user lifetime stats
    - Return created entry with calculated emissions

    - _Requirements: 1.1, 1.5, 3.1, 3.2, 8.1, 8.5_
  - [ ] 3.2 Implement POST /api/entries/plastic endpoint
    - Accept plasticType, quantity, unit, and date
    - Calculate emissions using EmissionCalculator

    - Save entry and update user stats
    - _Requirements: 1.2, 1.5, 6.1, 6.2, 6.3, 8.1, 8.5_
  - [ ] 3.3 Implement POST /api/entries/energy endpoint
    - Accept energySource, amount, isRenewable, and date
    - Calculate emissions (zero if renewable)
    - Save entry and update user stats


    - _Requirements: 1.3, 1.5, 7.1, 7.2, 7.3, 7.4, 7.5, 8.1, 8.5_
  - [ ] 3.4 Implement POST /api/entries/plantation endpoint
    - Accept treesPlanted, date, and location

    - Calculate CO2 offset and eco points (10 points per tree)
    - Save entry and update user stats including eco points and trees planted
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.5_

  - [ ] 3.5 Implement GET /api/entries/history endpoint
    - Accept query params for weeks and type filter
    - Fetch entries from database with date range filtering
    - Calculate totals for emissions, offsets, and net footprint

    - _Requirements: 1.5, 4.1, 4.5, 8.2_

- [ ] 4. Implement analytics and dashboard services
  - [ ] 4.1 Create AnalyticsService class
    - Implement getWeeklyData method using MongoDB aggregation


    - Implement calculatePercentageChange method for week-over-week comparison
    - Implement getCategoryBreakdown method for emission breakdown by type
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_


  - [ ] 4.2 Implement GET /api/dashboard/summary endpoint
    - Calculate total emissions, offsets, net footprint, and eco points
    - Return summary statistics for dashboard display
    - _Requirements: 1.4, 2.4, 4.4_
  - [x] 4.3 Implement GET /api/analytics/weekly endpoint


    - Use AnalyticsService to aggregate 12 weeks of data
    - Calculate percentage change from previous week
    - Return weekly data array for chart visualization
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 4.4 Implement GET /api/user/profile endpoint
    - Fetch user data with lifetime statistics
    - Return total entries, emissions, offsets, eco points, and trees planted
    - _Requirements: 1.4, 2.4, 8.2, 8.3_

- [x] 5. Create frontend theme and layout components


  - [ ] 5.1 Implement global CSS with green and white color palette
    - Define CSS variables for primary greens (#2E7D32, #4CAF50, #81C784) and white (#FFFFFF, #F1F8E9)
    - Create utility classes for buttons, cards, and form elements
    - Style navigation bar with logo and menu items

    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [ ] 5.2 Create App component with navigation
    - Set up component structure with header, main content area, and footer
    - Implement navigation menu with Dashboard, Add Entry, History, and Profile links
    - Add routing logic for component switching
    - _Requirements: 5.1, 5.2_


- [ ] 6. Build Dashboard component
  - [ ] 6.1 Create Dashboard component with summary statistics
    - Fetch data from GET /api/dashboard/summary
    - Display stat cards for total emissions, offsets, net footprint, and eco points
    - Use green color for positive metrics and appropriate icons

    - Add loading states and error handling
    - _Requirements: 1.4, 2.4, 4.4, 5.1, 5.3, 5.4, 5.5_
  - [ ] 6.2 Add recent activity section to Dashboard
    - Fetch recent entries from API
    - Display last 7 days of entries with icons and details
    - Show mini trend chart using Recharts

    - _Requirements: 1.5, 4.1, 5.4, 5.5_

- [x] 7. Build AddEntry component with forms


  - [ ] 7.1 Create tab-based entry form interface
    - Implement tabs for Vehicles, Plastics, Energy, and Plantations
    - Add icons for each category
    - Set up form state management
    - _Requirements: 5.2, 5.4_

  - [ ] 7.2 Implement vehicle entry form
    - Create form fields for distance, fuel type dropdown, date, and description
    - Add real-time CO2 calculation preview
    - Submit to POST /api/entries/vehicle
    - Show success feedback with calculated emissions
    - _Requirements: 1.1, 3.1, 3.2, 5.3, 5.4, 5.5_

  - [ ] 7.3 Implement plastic entry form
    - Create form fields for plastic type dropdown, quantity, and date
    - Add real-time CO2 calculation preview
    - Submit to POST /api/entries/plastic
    - Show success feedback

    - _Requirements: 1.2, 6.1, 6.2, 5.5_
  - [ ] 7.4 Implement energy entry form
    - Create form fields for energy source dropdown, amount (kWh), renewable checkbox, and date
    - Add real-time CO2 calculation preview (show zero for renewable)
    - Submit to POST /api/entries/energy

    - Show success feedback
    - _Requirements: 1.3, 7.1, 7.2, 7.5, 5.5_


  - [ ] 7.5 Implement plantation entry form
    - Create form fields for number of trees, date, and location
    - Calculate and display CO2 offset and eco points preview (10 points per tree)
    - Submit to POST /api/entries/plantation
    - Show success feedback with green accent highlighting rewards

    - _Requirements: 2.1, 2.2, 2.4, 5.3, 5.5_

- [ ] 8. Build History component with data visualization
  - [ ] 8.1 Create History component layout
    - Fetch historical data from GET /api/entries/history

    - Fetch weekly analytics from GET /api/analytics/weekly
    - Add filter buttons for All, Vehicles, Plastics, Energy, Plantations
    - Implement loading states and error handling
    - _Requirements: 4.1, 4.5, 5.2_
  - [x] 8.2 Implement 12-week trend line chart

    - Use Recharts to create line chart showing weekly emissions
    - Display emissions, offsets, and net footprint lines
    - Use green colors for chart elements
    - Add tooltips with detailed data
    - _Requirements: 4.1, 4.2, 5.1, 5.5_

  - [ ] 8.3 Add weekly comparison cards
    - Display this week vs last week emissions
    - Calculate and show percentage change
    - Use green color for improvements, red for increases
    - _Requirements: 4.3, 4.4, 5.3, 5.5_

  - [ ] 8.4 Implement category breakdown visualization
    - Create pie chart or bar chart showing emissions by category
    - Use filter state to update visualization
    - Display breakdown for vehicles, plastics, energy separately
    - _Requirements: 3.3, 4.5, 5.4, 5.5_
  - [ ] 8.5 Add CSV export functionality
    - Implement export button

    - Format historical data as CSV
    - Trigger download with filename including date range
    - _Requirements: 8.4_

- [x] 9. Build Profile component

  - [ ] 9.1 Create Profile component with lifetime statistics
    - Fetch user profile from GET /api/user/profile
    - Display lifetime stats: total entries, emissions, offsets, eco points, trees planted
    - Use stat cards with icons and green accents
    - Add loading states

    - _Requirements: 1.4, 2.4, 8.2, 8.3, 5.1, 5.4, 5.5_
  - [ ] 9.2 Add achievements section
    - Display achievement badges for milestones
    - Show progress toward next achievements
    - Use green colors for earned achievements
    - _Requirements: 2.4, 5.3_



- [ ] 10. Implement error handling and validation
  - [ ] 10.1 Add frontend form validation
    - Validate required fields before submission
    - Validate numeric inputs (distance, quantity, amount must be positive)
    - Show inline error messages in red
    - Prevent submission with invalid data
    - _Requirements: 1.1, 1.2, 1.3, 2.1_
  - [ ] 10.2 Add backend validation middleware
    - Create validation functions for each entry type
    - Return 400 errors with descriptive messages for invalid data
    - Validate fuel types, plastic types, energy sources against allowed values
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 6.1, 7.1_
  - [ ] 10.3 Implement error handling UI
    - Add toast notifications for API errors
    - Display user-friendly error messages
    - Add retry functionality for failed requests
    - Show network error states
    - _Requirements: 8.5_

- [ ] 11. Add plastic consumption suggestions feature
  - Create logic to check weekly plastic emissions
  - Display suggestions when emissions exceed 5 kg CO2 per week
  - Show suggestions in Dashboard or Profile component
  - Use informational styling with tips for reduction
  - _Requirements: 6.5_

- [ ] 12. Wire up all components and test end-to-end flows
  - [ ] 12.1 Connect all components with API integration
    - Verify all API calls work correctly
    - Test data flow from forms to database to display
    - Ensure user stats update correctly after each entry
    - Test navigation between all components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 8.1, 8.2, 8.5_
  - [ ] 12.2 Verify calculation accuracy
    - Test vehicle emissions with sample data (100km petrol should be ~18.48 kg CO2)
    - Test plastic emissions (1kg should be 6 kg CO2)
    - Test energy emissions (100 kWh electricity should be 42 kg CO2)
    - Test tree offset (1 tree should offset 22 kg CO2 and award 10 points)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.4, 3.5, 6.3, 7.3, 7.4_
  - [ ] 12.3 Test historical data and analytics
    - Add multiple entries across different weeks
    - Verify weekly aggregation is correct
    - Test percentage change calculations
    - Verify chart displays correct data
    - Test category filtering
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ] 12.4 Perform visual design review
    - Verify green and white color scheme is consistent throughout
    - Check all icons are displaying correctly
    - Test responsive design on different screen sizes
    - Verify all numerical data shows correct units
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
