# SmartCertify

**A modern online course certification platform built with Angular 19 and .NET 9**

## 🚀 Project Overview

SmartCertify is a full-stack web application for online learning and certification management. Users can browse courses, take exams, and earn certifications in various technology domains.

## 🛠️ Tech Stack

### Frontend
- **Angular 19** - Modern TypeScript framework
- **Bootstrap** - Responsive UI components
- **Azure AD B2C** - User authentication and management

### Backend
- **.NET 9 Web API** - RESTful API with Clean Architecture
- **Entity Framework Core** - Database ORM
- **SQL Server** - Primary database

### Cloud Services
- **Azure App Service** - Application hosting
- **Azure SQL Database** - Cloud database
- **Azure Blob Storage** - File storage
- **Azure AD B2C** - Identity management

## 🌟 Features

- 📚 Course catalog with video content
- 📝 Interactive exams and quizzes
- 🏆 Digital certification system
- 👤 User profile management
- 📊 Progress tracking
- 🔐 Secure authentication
- 📱 Responsive design

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 19
- .NET 9 SDK
- SQL Server or SQL Express

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/SmartCertify.git
   cd SmartCertify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API and business logic
│   ├── models/        # TypeScript interfaces
│   └── guards/        # Route protection
├── assets/           # Static files and images
└── environments/     # Configuration files
```

## 🔧 Configuration

Update the environment files for your setup:
- `src/environments/environment.ts` - Development settings
- `src/environments/environment.prod.ts` - Production settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Demo:** [smartcertify-web.azurewebsites.net](https://smartcertify-web.azurewebsites.net/home)
