
// Global variables
var github
var context

async function main({ g, c }) {
  github = g
  context = c

  const query = `
    query findIssuesAndSubfields($owner: String!, $repo: String!, $projectNumber: Int!, $num: Int=25, $cursor: String) {
      repository(owner: $owner, name: $repo) {
        projectV2(number: $projectNumber) {
          items(first: $num, after: $cursor) {
            nodes{
              fieldValueByName(name:"Status") {
                __typename
                ... on ProjectV2ItemFieldSingleSelectValue {
                  id
                  name
                }
              }
              content{
                __typename
                ... on Issue {
                  number
                  title
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    owner: "hackforla",
    // owner: context.repo.owner,
    repo: context.repo.repo,
    projectNumber: 86,
  };
    
  try {
    const result = await github.graphql.paginate(query, variables);

    // Parse the returned data
    const items = result.repository.projectV2.items.nodes.map(node => ({
      issue: {
        number: node.content.number,
        title: node.content.title,
        id: node.content.id,
      },
      status: {
        id: node.fieldValueByName.id,
        name: node.fieldValueByName.name,
      }
    }));

    console.log('Parsed Items:', items);

    // Set output for use in other workflow steps
    context.setOutput('items', JSON.stringify(items));
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
  }



  
  const query = `
    query findStatusSubfieldIds($login: String!, $projectNumber: Int!) {
      organization(login: $login) {
        projectV2(number: $projectNumber) {
          field(name: "Status") {
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                id
                name
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    login: 'hackforla', 
    projectNumber: 86
  };

  try {
    const result = await github.graphql(query, variables);

    const statusField = result.organization.projectV2.field;
    const fieldId = statusField.id;
    const fieldName = statusField.name;
    const options = statusField.options.map(option => ({
      id: option.id,
      name: option.name
    }));

    console.log(`Field ID: ${fieldId}`);
    console.log(`Field Name: ${fieldName}`);
    console.log('Options:', options);

    // Do something with the parsed data
    // For example, you could set output variables for other steps in the workflow
    console.log('Setting outputs...');
    c.setOutput('field_id', fieldId);
    c.setOutput('field_name', fieldName);
    c.setOutput('options', JSON.stringify(options));

  } catch (error) {
    console.error('Error executing GraphQL query:', error);
  }

/*
  const { allIssues } = await github.graphql(
    `
      query allIssues{
        organization(login:"hackforla") {
          projectV2(number: 86) {
           field(name:"Status") { 
              ... on ProjectV2SingleSelectField { 	
              id options{ 
                  __typename
                  id 
                  name
                  ... on ProjectV2SingleSelectFieldOption {
                    name
                    description
                  }
                } 
              }
            }
          }
        }
      }
    `
  );
  
  console.log(`line 49`);
  console.log(JSON.parse(allIssues));
  console.log(`line 51`);
  console.log(allIssues.data);
  console.log(`line 53`);
*/
/*
  const { lastIssues } = await github.graphql(
    `
      query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
        repository(owner: $owner, name: $repo) {
          issues(last: $num) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    `,
    {
      owner: "t-will-gillis",
      repo: "website",
    },
  );

  console.log(lastIssues);
  console.log(JSON.parse(lastIssues));




const lotsaData = await github.graphql(
  `
    query lotsaData{
      repository(owner:"t-will-gillis", name:"website") {
        projectV2(number:5){
          items(first:10 ){
            pageInfo{ hasNextPage }
            nodes{
              fieldValueByName(name:"Status"){
                __typename
                ... on ProjectV2ItemFieldSingleSelectValue{
                  id
                  name
                }
              }
              content{
                __typename
                ... on Issue{
                  number
                  title
                  id
                }
              }
            }
          }
        }
      }
    }
    `
  );

  console.log(`line 109`);
  console.log(JSON.parse(lotsaData.data));
*/

}

module.exports = main;
