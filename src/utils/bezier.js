/**
 * @description 根据两个经纬度坐标以及高度定义，返回抛物线坐标数据
 * @param {position} array [lon1, lat1, lon2, lat2, h]
 * @returns 返回两点的贝塞尔曲线点
 */
export function getBSRxyz(lon1, lat1, lon2, lat2, h) {
  let arr3d = getBSRPoints(lon1, lat1, lon2, lat2, h);
  let arrAll = [];
  for (let ite of arr3d) {
    arrAll.push(ite[0]);
    arrAll.push(ite[1]);
    arrAll.push(ite[2]);
  }

  console.log(arrAll);
  return Cesium.Cartesian3.fromDegreesArrayHeights(arrAll);
}

function getBSRPoints(x1, y1, x2, y2, h) {
  let point1 = [y1, 0];
  let point2 = [(y2 + y1) / 2, h];
  let point3 = [y2, 0];
  let arr = getBSR(point1, point2, point3);
  let arr3d = [];
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
    // TODO 当y2、y1坐标一至时，此处会出现错误
    if (y1 === y2) {
      let x = ((x2 - x1) * (arr[i][0] - y1)) / (y2 - y1) + x1;
      arr3d.push([x, arr[i][0], arr[i][1]]);
    } else {
      let x = ((x2 - x1) * (arr[i][0] - y1)) / (y2 - y1) + x1;
      arr3d.push([x, arr[i][0], arr[i][1]]);
    }
  }
  console.log(arr3d);
  return arr3d;
}

function getBSR(point1, point2, point3) {
  let ps = [
    { x: point1[0], y: point1[1] },
    { x: point2[0], y: point2[1] },
    { x: point3[0], y: point3[1] }
  ];
  // 100 每条线由100个点组成
  let guijipoints = CreateBezierPoints(ps, 100);
  return guijipoints;
}

/**
 * @description 贝赛尔曲线算法
 * @param {anchorpoints} array [{ x: 116.30, y: 39.60 }, { x: 37.50, y: 40.25 }, { x: 39.51, y: 36.25 }]
 * @param {pointsAmount} number 组成曲线的线段数量，值越大曲线约平滑
 * */
function CreateBezierPoints(anchorpoints, pointsAmount) {
  let points = [];
  for (var i = 0; i < pointsAmount; i++) {
    let point = MultiPointBezier(anchorpoints, i / pointsAmount);
    console.log(point);
    points.push([point.x, point.y]);
  }
  return points;
}

function MultiPointBezier(points, t) {
  let len = points.length;
  let x = 0;
  let y = 0;
  // 计算二项式
  function erxiangshi(start, end) {
    let cs = 1;
    let bcs = 1;
    while (end > 0) {
      cs *= start;
      bcs *= end;
      start--;
      end--;
    }
    return cs / bcs;
  }
  for (let i = 0; i < len; i++) {
    let point = points[i];
    x += point.x * Math.pow(1 - t, len - 1 - i) * Math.pow(t, i) * erxiangshi(len - 1, i);
    y += point.y * Math.pow(1 - t, len - 1 - i) * Math.pow(t, i) * erxiangshi(len - 1, i);
  }
  return { x: x, y: y };
}
