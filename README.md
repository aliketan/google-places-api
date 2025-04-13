<h1 align="center" id="title">Google Places API</h1>

<p id="description">This project is an address autocomplete form project created using the Google Places API.</p>


<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository</p>

```
git clone https://github.com/aliketan/google-places-api.git
```

<p>2. Open Visual Studio Code or similar IDEs</p>

<p>3. Change directory to the project</p>

```
cd google-places-api
```

<p>4. Install node modules</p>

```
npm install
```

<p>5. Change API Key in src > js > main.js</p>

```
const apiKey = "YOUR_API_KEY";

var addressInput = $("input[name='address']");
addressInput.geoCodePlaces({ 
    apiKey: apiKey,
    address:'input[name="address"]',
    country:'select[name="country"]',
    city:'input[name="city"]',
    zip:'input[name="postalcode"]',
    province:'input[name="province"]'
});
```

<p>5. Run the project</p>

```
npm run start
```

<p>6. Compile for development</p>

```
npm run dev
```

<p>7. Compile for production</p>

```
npm run build
```

<h2>Project Screenshots:</h2>

<img src="https://raw.githubusercontent.com/aliketan/aliketan/refs/heads/main/assets/google-places-api-ss.png" alt="project-screenshot" width="100%" height="400/">