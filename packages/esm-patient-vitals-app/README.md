# esm-patient-vitals-app

The vitals widget. It provides tabular and chart-based overviews of the vitals recorded for a patient as well as a form for recording vitals and biometrics. It also provides a vitals header that displays a summary of the most recently recorded vitals.

## Features

- **Vitals Overview**: Displays patient vitals in tabular and chart formats.
- **Biometrics Integration**: Includes biometrics data alongside vitals.
- **Vitals Header**: Shows a summary of the latest vitals.
- **Form for Recording**: Allows recording new vitals and biometrics.
- **Stigma Data Support**: Includes features for handling stigma-related data (e.g., stigma scores, conference dashboards).
- **Printing Support**: Print vitals data.
- **Chart Visualizations**: Interactive charts for vitals trends.
- **Pagination**: Handles large datasets with pagination.
- **Responsive Design**: Adapts to tablet and desktop layouts.

## Installation

This package is part of the OpenMRS ESM Patient Chart monorepo. To install dependencies for the entire project:

```bash
yarn install
```

To run this specific package in development mode:

```bash
yarn start --sources 'packages/esm-patient-vitals-app'
```

## Usage

### Components

- **VitalsOverview**: Main component for displaying vitals data. Supports table and chart views, stigma data integration.
- **VitalsChart**: Renders interactive charts for vitals trends.
- **PaginatedVitals**: Handles pagination for vitals data.
- **PrintComponent**: Provides printing functionality for vitals.
- **VitalsHeader**: Displays summary of latest vitals.
- **BiometricsOverview**: Overview for biometrics data.
- **Stigma Components**: Includes stigma data aggregation, conference dashboards, and related modals.

### Configuration

The app uses a configuration schema defined in `config-schema.ts`. Key configurations include:

- Vitals concepts and units.
- Biometrics settings.
- Stigma data handling.

Example configuration:

```json
{
  "vitals": {
    "concepts": ["bloodPressure", "heartRate", "temperature"],
    "biometrics": ["weight", "height"]
  }
}
```

### API

#### Hooks

- `useVitalsAndBiometrics`: Fetches vitals and biometrics data.
- `useConceptUnits`: Retrieves units for concepts.
- `useCovidStigmaData`: Fetches stigma-related data.

#### Utilities

- `withUnit`: Formats values with units.
- `useLaunchVitalsAndBiometricsForm`: Launches the form for recording data.

### Extensions

- Dashboard links for vitals and biometrics.
- Workspace for recording vitals.
- Modals for deleting vitals/biometrics.

## Development

### Scripts

- `yarn start`: Start development server.
- `yarn build`: Build for production.
- `yarn test`: Run tests.
- `yarn lint`: Lint code.
- `yarn typescript`: Check TypeScript.

### Testing

Run tests with:

```bash
yarn test
```

For watch mode:

```bash
yarn test:watch
```

### Dependencies

Key dependencies:

- `@carbon/react`: UI components.
- `@carbon/charts-react`: Charting library.
- `chart.js`: Chart rendering.
- `@openmrs/esm-framework`: OpenMRS framework.
- `@openmrs/esm-patient-common-lib`: Common patient library.

Peer dependencies include React, RxJS, etc.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make changes and add tests.
4. Run `yarn lint` and `yarn test`.
5. Submit a pull request.

## Documentation

For detailed technical documentation of individual components and workflows:

- [Vitals Overview Dashboard](docs/vitals-overview-dashboard.md) - Complete guide to the main vitals dashboard component, including code snippets, workflow, and technical details.
- [Vitals Table Workflow](docs/vitals-table-workflow.md) - Detailed breakdown of files responsible for fetching, processing, and rendering vitals/biometrics table data.
- [Workflow Documentation Topics](docs/workflow-documentation-topics.md) - Comprehensive framework for documenting all workflows in the vitals app, with in-depth examples of "what does what" and "which function is responsible for what".
- [Stigma Data Resource](docs/stigma-data-resource.md) - Overview of the stigma data management system with clinical logic and data transformation.
- [Stigma Data Resource - Technical](docs/stigma-data-resource-technical.md) - Comprehensive technical documentation explaining what the stigma-data.resource.tsx file does and its responsibilities in the system.
- [Stigma Data Fetching Process](docs/stigma-data-fetching-process.md) - Detailed technical explanation of how stigma encounter variables are fetched, including API calls, data extraction, and processing logic.

