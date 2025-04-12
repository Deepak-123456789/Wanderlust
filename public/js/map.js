let key = mapToken;
var styleJson =
  "https://tiles.locationiq.com/v3/streets/vector.json?key=" + key;

const map = new ol.Map({
  target: "map",
  view: new ol.View({
    center: ol.proj.fromLonLat(cord),
    zoom: 9,
  }),
});

olms.apply(map, styleJson).then(() => {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(cord)),
  });

  marker.setStyle(
    new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
        scale: 0.08,
      }),
      zIndex: 1000,
    })
  );

  const vectorSource = new ol.source.Vector({
    features: [marker],
  });

  const markerLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  map.addLayer(markerLayer);
});
