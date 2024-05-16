export const fetchUserLabels = async (address) => {
  try {
    const result = await fetch(`api/all-user-data?address=${address}`);
    const response = await result.json();
    var allNames = [];
    var allAddress = [];
    if (response.result) {
      const alldata = response?.result;
      allNames = alldata?.map((user) => user.name);
      allAddress = alldata?.map((user) => user.address);
    }
    console.log(allNames, allAddress);
    return { allNames, allAddress };
  } catch (error) {
    const allNames = [];
    const allAddress = [];
    console.error("Error fetching user details:", error);
    return { allNames, allAddress };
  }
};
