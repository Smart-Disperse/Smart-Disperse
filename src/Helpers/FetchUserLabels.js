export const fetchUserLabels = async (address) => {
  try {
    const result = await fetch(`api/all-user-data?address=${address}`);
    const response = await result.json();
    const alldata = response?.result;
    const allNames = alldata?.map((user) => user.name);
    const allAddress = alldata?.map((user) => user.address);
    return { allNames, allAddress };
  } catch (error) {
    const allNames = [];
    const allAddress = [];
    console.error("Error fetching user details:", error);
    return { allNames, allAddress };
  }
};
