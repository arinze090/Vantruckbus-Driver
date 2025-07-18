export const checkDriverProfile = async (
  dispatch,
  getUser,
  axiosInstance,
  setLoading,
) => {
  try {
    const profileResponse = await axiosInstance({
      url: 'api/profile/driverprofile',
      method: 'GET',
    });

    console.log('checkDriverProfile res', profileResponse?.data);
    setLoading(false);

    if (profileResponse?.data) {
      dispatch(getUser(profileResponse?.data));
    }
  } catch (error) {
    console.error('checkDriverProfile check error:', error);
    setLoading(false);
  }
};

export const fetchTruckListings = async (
  axiosInstance,
  dispatch,
  saveTruckListings,
) => {
  try {
    await axiosInstance({
      url: 'api/listings/all-offerings',
      method: 'GET',
    })
      .then(res => {
        console.log('fetchTruckListings res', res?.data);
        dispatch(saveTruckListings(res?.data?.data));
      })
      .catch(err => {
        console.log('fetchTruckListings err', err?.response?.data);
      });
  } catch (error) {
    console.log('fetchTruckListings error', error);
  }
};
