const queryString = window.location.search;
id = queryString.substring(queryString.length - 24);
async function fetchData() {
  const url = `/api/v1/challenges/${id}`;
  const response = await fetch(url);
  // wait until request has been completed
  const datapoints = await response.json();
  // check response
  return datapoints;
}

fetchData().then((datapoints) => {
  // crunch the numbers & prepare the datasets
  const summary = datapoints.challenge.workouts.map(function (index) {
    return index.sets;
  });
  console.log(summary);
});
