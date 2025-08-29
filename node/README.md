```bash
app/
  bin/    # This folder would be an entrypoint-script(s) to our app
  dist/   # Here, we'll have the built code for production version
  src/
    config/         # App's constants/enums/other configuration
    interfaces/     # Interfaces for different parts of an app
    controllers/    # These are called by your implementation (infrastructure) layer.
    entities/       # Core business objects will be here.
    use-cases/      # Core business logic goes here
    infrastructure/ # This folder will contain actual implementations
  temp/   # Misc. and temp files would go here, delete if not needed
  .env    # An app's environment and sensitive information
  package.json
  tsconfig.json
```
