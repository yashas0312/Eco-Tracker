# EcoTracker Setup Guide

## Overview
EcoTracker is a carbon footprint tracking application with a green and white theme. It allows users to track vehicle emissions, plastic consumption, energy usage, and tree plantations.

## Features Implemented
✅ Vehicle tracking (petrol, diesel, electric, hybrid, CNG)
✅ Plastic consumption tracking
✅ Energy/heating tracking with renewable option
✅ Tree plantation tracking with eco points (10 points per tree)
✅ Dashboard with summary statistics
✅ Historical data visualization (12-week trends)
✅ Weekly progress comparison
✅ Profile with lifetime statistics
✅ Achievement system
✅ CSV export functionality
✅ Green and white color scheme

## Running the Application

### Backend (Already Running)
The backend is running on http://localhost:4000

### Frontend (Already Running)
The frontend is running on http://localhost:3000

Open your browser and navigate to: **http://localhost:3000**

## Using the Application

### 1. Dashboard
- View your total CO₂ emissions, offsets, net footprint, and eco points
- See quick stats and environmental impact

### 2. Add Entry
Choose from 4 tabs:
- **🚗 Vehicles**: Log distance and fuel type
- **♻️ Plastics**: Log plastic consumption by type and quantity
- **🔥 Energy**: Log energy usage (supports renewable energy)
- **🌳 Plantations**: Log trees planted (earns 10 eco points per tree!)

### 3. History
- View 12-week emission trends with interactive charts
- See weekly comparison (this week vs last week)
- Filter by category (All, Vehicles, Plastics, Energy, Plantations)
- Export data to CSV

### 4. Profile
- View lifetime statistics
- See earned achievements
- Track progress toward next milestones

## Database Setup (Optional)

If you want to use MongoDB:

1. Install MongoDB locally or use MongoDB Atlas
2. Set the MONGO_URI environment variable:
   ```
   set MONGO_URI=mongodb://localhost:27017/ecotracker
   ```
3. Run the seed script to create a test user:
   ```
   cd backend
   node seedTestData.js
   ```

## Test User
The application uses a mock user ID: `675210a1b2c3d4e5f6789012`

## Emission Factors Used

### Vehicles
- Petrol: 2.31 kg CO₂/L (0.08 L/km) = ~18.48 kg CO₂ per 100km
- Diesel: 2.68 kg CO₂/L (0.07 L/km) = ~18.76 kg CO₂ per 100km
- Electric: 0.42 kg CO₂/kWh (0.2 kWh/km) = ~8.4 kg CO₂ per 100km
- Hybrid: 1.5 kg CO₂/L (0.05 L/km) = ~7.5 kg CO₂ per 100km
- CNG: 2.75 kg CO₂/kg (0.06 kg/km) = ~16.5 kg CO₂ per 100km

### Plastics
- All types: 6 kg CO₂ per kg of plastic

### Energy
- Natural Gas: 0.18 kg CO₂/kWh
- Electricity: 0.42 kg CO₂/kWh
- Heating Oil: 0.27 kg CO₂/kWh
- Coal: 0.34 kg CO₂/kWh
- Renewable: 0 kg CO₂/kWh

### Tree Plantations
- CO₂ Offset: 22 kg per tree per year
- Eco Points: 10 points per tree

## Color Scheme
- Dark Green: #2E7D32 (primary actions, headers)
- Medium Green: #4CAF50 (accents, positive feedback)
- Light Green: #81C784 (hover states)
- Very Light Green: #F1F8E9 (backgrounds)
- White: #FFFFFF (main background)

## API Endpoints

### Entry Management
- POST /api/entries/vehicle
- POST /api/entries/plastic
- POST /api/entries/energy
- POST /api/entries/plantation
- GET /api/entries/history

### Dashboard & Analytics
- GET /api/dashboard/summary
- GET /api/analytics/weekly
- GET /api/user/profile
- GET /api/entries/recent

## Testing
Backend unit tests are available:
```
cd backend
npm test
```

All 24 calculation tests pass successfully!

## Next Steps
1. Open http://localhost:3000 in your browser
2. Start adding entries using the "Add Entry" tab
3. Watch your carbon footprint grow or shrink!
4. Plant trees to earn eco points and offset emissions
5. Track your progress in the History and Profile sections

Enjoy tracking your carbon footprint! 🌱
