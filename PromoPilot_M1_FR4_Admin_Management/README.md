# PromoPilot — M1-FR4 Admin Management

Includes a basic admin dashboard and API for:
- Viewing counts of users, businesses, products, content items and campaigns
- Listing records in each section
- Editing a record's name/title
- Suspending or reactivating users
- Removing users and other records

The API uses MongoDB database `promopilot` on localhost and port 5001.
The models here are simple starter models. Connect them to the team's existing models before merging.

Important: this is a basic module scaffold, not a complete secure admin system. In a real application, admin routes must be protected by authentication and server-side role checks. The UI alone does not enforce admin permissions.
