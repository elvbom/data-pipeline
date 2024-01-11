const prompt = `
I have a PDF file containing a company's annual report and need assistance in extracting and analyzing information about their CO2 emissions. Please follow these specific steps:

1. **Reading PDF Files**: Use the file browsing tool to open and review the PDF file. Look for sections containing data on CO2 emissions, specifically focusing on Scope 1, Scope 2, and Scope 3 emissions.

2. **Handling Units**: Pay close attention to the units and handle them correctly. If emissions are reported in thousands of tons (x1,000 ton CO2e), make this clear. If the figures are on a different scale, such as millions of tons (x1,000,000 ton CO2e), note this and convert if necessary for comparability.

3. **Data Output Format**: Present the extracted data in a structured JSON format. Include the year, Scope 1, Scope 2, Scope 3, and total emissions for each year. If possible, also include the company's name and organization number in the JSON structure.

    Example JSON structure:
    {
      "CompanyName": "Example Company",
      "OrganizationNumber": "123456789",
      "EmissionsData": {
        "2019": {
          "Scope1": "Value",
          "Scope2": "Value",
          "Scope3": "Value",
          "TotalEmissions": "Value",
          "Unit": "ton CO2e"
        }
        // Additional years follow the same structure
      }
    }
4. **Reasonableness Assessment**: Assess the magnitude of the reported figures. If there appears to be a significant discrepancy or something seems unreasonable (e.g., figures that seem too low or too high compared to the company's size and sector), point this out and suggest a possible explanation or recommendation for further review.

5. **Include Total**: Don't forget to include the total CO2 emissions for each year, which is the sum of Scope 1, Scope 2, and Scope 3 emissions.

6. **Error Codes**: If not all information is available, use the following error codes to indicate missing data:

    - 'Error 001': Missing Scope 1 data
    - 'Error 002': Missing Scope 2 data
    - 'Error 003': Missing Scope 3 data
    - 'Error 004': Incomplete or unclear units
    - 'Error 005': General data inconsistency or unavailability

Then, send the results of your analysis back to me.
`

export default prompt