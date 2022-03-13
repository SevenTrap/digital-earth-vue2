/**
 * @description 根据两个经纬度坐标，计算两点之间的距离
 * @param {position} array [lon1, lat1, lon2, lat2]
 * @returns 返回两点之间的距离，单位是“米”
 */
export function getDistanceBetweenTwoPoints(arr) {
  let [lon1, lat1, lon2, lat2] = arr;
  const EARTH_RADIUS = 6378137.0;
  const PI = Math.PI;

  function getRad(d) {
    return (d * PI) / 180.0;
  }

  let f = getRad((lat1 + lat2) / 2);
  let g = getRad((lat1 - lat2) / 2);
  let l = getRad((lon1 - lon2) / 2);

  let sf = Math.sin(f);
  let sg = Math.sin(g);
  let sl = Math.sin(l);

  let fl = 1 / 298.257;

  sf = sf * sf;
  sg = sg * sg;
  sl = sl * sl;

  let s = sg * (1 - sl) + (1 - sf) * sl;
  let c = (1 - sg) * (1 - sl) + sf * sl;

  let w = Math.atan(Math.sqrt(s / c));
  let r = Math.sqrt(s * c) / w;
  let d = 2 * w * EARTH_RADIUS;
  let h1 = (3 * r - 1) / 2 / c;
  let h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}
