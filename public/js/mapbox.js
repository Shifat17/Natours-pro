export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic2hpZmF0MTciLCJhIjoiY2t1OGtsaW8wMHIwbjJ3bnphbW5sdTBrcyJ9.RcdZP5Is3WFTg9gwjn-tRQ';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/shifat17/ckucb3nbx720919nsg7elgiqr',
    scrollZoom: false,
    center: [-118.331524, 34.054284], // starting position [lng, lat]
    zoom: 10, // starting zoom
  });

  // creating a marker and making the bounds

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // add the marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day: ${loc.day}  ${loc.description} </p>`)
      .addTo(map);

    // extends the bounds to fit the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100,
    },
  });
};
