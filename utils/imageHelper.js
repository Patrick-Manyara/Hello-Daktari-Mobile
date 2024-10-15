const getImageUri = (imageUrl, imageName) => {
  if (imageName === null || imageName === "") {
    imageName = "profile.png";
  } else {
    imageName = imageName;
  }
  return imageUrl + imageName;
};

export default getImageUri;
