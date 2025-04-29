# Dynamic Student Form Wizard
A minimal React + TypeScript SPA that lets any student log in with a roll-number & name, then walks them through a fully-dynamic, multi-section form—all driven by metadata fetched at runtime.

# Features

Zero Hard-Coding	: Every section & field is rendered straight from the /get-form JSON.
Per-Section Validation	: Users can’t move to the next section until the current one passes rules like required, minLength, etc.
Prev / Next Navigation :	Seamless wizard flow; only the final screen shows Submit.
Student Registration :	POST /create-user registers (rollNumber + name) before the form appears.
Dynamic Field Types	: Text, tel, email, textarea, date, dropdown, radio, checkbox—whatever the API sends.
Console-First Submit : 	On the last step, the complete payload is simply console.log’d (no backend dependency).
Clean UI	: Lightweight styling focused on UX clarity, not flashiness.
