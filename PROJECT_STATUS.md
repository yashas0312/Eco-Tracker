# EcoTracker - Project Status

## ✅ Application Running

**Backend:** http://localhost:4000 (Running)
**Frontend:** http://localhost:3000 (Starting...)

## Features Implemented

### ✅ Complete Green & White Theme
- Dark Green (#2E7D32), Medium Green (#4CAF50), Light Green (#81C784)
- White backgrounds with green accents
- Professional, eco-friendly design

### ✅ Dashboard
- Summary statistics (emissions, offsets, net footprint, eco points)
- Welcome banner for new users
- Quick action buttons for all entry types
- Educational info cards

### ✅ Add Entry Forms
- **Vehicle Tracking:** Petrol, Diesel, Electric, Hybrid, CNG
- **Plastic Tracking:** Single-use, Bottles, Bags, Packaging
- **Energy Tracking:** Natural Gas, Electricity, Heating Oil, Coal (with renewable option)
- **Tree Plantations:** Earn 10 eco points per tree, 22 kg CO₂ offset per tree

### ✅ History & Analytics
- 12-week emission trends with charts
- Weekly comparison (this week vs last week)
- Category filtering
- CSV export functionality

### ✅ Profile
- Lifetime statistics
- Achievement system
- Progress tracking
- Next milestones

## Works Without MongoDB!

All features work without database:
- ✅ Add entries and see calculations
- ✅ View dashboard with welcome screen
- ✅ All forms calculate emissions/offsets correctly
- ✅ Success messages show calculated values

## Emission Factors

### Vehicles (per 100km)
- Petrol: ~18.48 kg CO₂
- Diesel: ~18.76 kg CO₂
- Electric: ~8.4 kg CO₂
- Hybrid: ~7.5 kg CO₂
- CNG: ~16.5 kg CO₂

### Plastics
- All types: 6 kg CO₂ per kg

### Energy
- Natural Gas: 0.18 kg CO₂/kWh
- Electricity: 0.42 kg CO₂/kWh
- Heating Oil: 0.27 kg CO₂/kWh
- Coal: 0.34 kg CO₂/kWh
- Renewable: 0 kg CO₂/kWh

### Trees
- CO₂ Offset: 22 kg per tree per year
- Eco Points: 10 points per tree

## How to Use

1. Open http://localhost:3000 in your browser
2. Click "Add Entry" in the navigation
3. Choose a tab (Vehicles, Plastics, Energy, or Plantations)
4. Fill in the form and submit
5. See your calculated CO₂ emissions or offsets!

## Next Steps (Optional)

To enable data persistence:
1. Install MongoDB
2. Set MONGO_URI environment variable
3. Restart backend
4. All entries will be saved and historical data will work

Enjoy tracking your carbon footprint! 🌱
