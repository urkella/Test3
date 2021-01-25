import axios from "axios";

export const API = "https://api.spacexdata.com/v4";

const getInfo = () => {
  axios
    .get(`${API}/company`)
    .then((res) => {
      var selector = document.getElementById("info");

      var createName = document.createElement("li");
      var createFounded = document.createElement("li");
      var createHeadquarters = document.createElement("li");

      createName.innerHTML = res.data.name;
      createFounded.innerHTML = res.data.founded;
      createHeadquarters.innerHTML = `${res.data.headquarters.city}, ${res.data.headquarters.state}, ${res.data.headquarters.address}`;

      selector.append(createName, createFounded, createHeadquarters);
    })
    .catch((e) => console.error("Error:", e));
};

const getNextLaunch = () => {
  axios
    .get(`${API}/launches/next`)
    .then((res) => {
      var selector = document.getElementById("launch");

      var createNextLaunchName = document.createElement("p");
      var createNextLaunchImg = document.createElement("IMG");

      createNextLaunchName.innerHTML = `Mission name: ${res.data.name}`;

      // Img attributes
      createNextLaunchImg.setAttribute("src", res.data.links.patch.small);
      createNextLaunchImg.setAttribute("width", "304");
      createNextLaunchImg.setAttribute("height", "228");
      createNextLaunchImg.setAttribute("alt", res.data.mission_name);
      createNextLaunchImg.style.objectFit = "contain";

      selector.append(createNextLaunchName, createNextLaunchImg);

      return getRocketById(res.data.rocket);
    })
    .catch((e) => console.error("Error:", e));
};

let starlinks = [];

const starLinkRockets = () => {
  axios
    .get(`${API}/starlink`)
    .then((res) => {
      const r = res.data;

      var selector = document.getElementById("allStarLinks");
      var select = document.getElementById("star");

      const findAvailableVersions = res.data.filter(
        (v, i, a) => a.findIndex((t) => t.version === v.version) === i
      );

      findAvailableVersions.map((i) => {
        var starLinkOption = document.createElement("option");
        starLinkOption.innerHTML = i.version;

        select.append(starLinkOption);
      });

      for (const property in r) {
        var starLink = document.createElement("li");
        starLink.innerHTML = `Name: ${r[property].spaceTrack.TLE_LINE0}, Version: ${r[property].version}`;

        selector.append(starLink);
      }

      starlinks = res.data;
    })
    .catch((e) => console.error("Error:", e));
};

const selectElement = document.querySelector("#star");

selectElement.addEventListener("change", (event) => {
  var s = document.getElementById("allStarLinks");
  s.innerHTML = "";

  const r = starlinks.filter((i) => i.version === event.target.value);

  r.map((i) => {
    var newStarLink = document.createElement("li");
    newStarLink.innerHTML = `Name: ${i.spaceTrack.TLE_LINE0}, Version: ${i.version}`;

    s.append(newStarLink);
  });
});

export const getRocketById = (id) => {
  axios
    .get(`${API}/rockets/${id}`)
    .then((res) => {
      var selector = document.getElementById("rocket");

      var createRocketName = document.createElement("p");
      var createRocketImg = document.createElement("IMG");

      createRocketName.innerHTML = `Rocket name: ${res.data.name}`;

      // Img attributes
      createRocketImg.setAttribute("src", res.data.flickr_images[0]);
      createRocketImg.setAttribute("width", "304");
      createRocketImg.setAttribute("height", "228");
      createRocketImg.setAttribute("alt", res.data.name);
      createRocketImg.style.objectFit = "contain";
      selector.append(createRocketName, createRocketImg);
    })
    .catch((e) => console.error("Error:", e));
};

const runAll = () => {
  getInfo();
  getNextLaunch();
  starLinkRockets();
};

runAll();
