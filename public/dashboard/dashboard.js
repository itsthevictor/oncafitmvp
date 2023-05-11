getData();

async function getData() {
  const response = await fetch("api/v1/users/showMe");
  const data = await response.json();
  console.log(data);
}
