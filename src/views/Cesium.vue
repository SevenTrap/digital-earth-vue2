<template>
  <div class="cesium">
    <div id="cesiumContainer"
         class="cesiumContainer"></div>

    <div class="func-btns">
      <button class="btn"
              @click="handlerScreenShots()">截图</button>

      <button class="btn"
              @click="handlerPolyline()">画线</button>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { getDistanceBetweenTwoPoints } from "@/utils/index.js";
import { getBSRxyz } from "@/utils/bezier.js";
export default {
  data() {
    return {
      cesiumViewer: null,
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZGMwM2M2OC02ZGYwLTQ5NzQtYjBkOS1lYTM0MmYxNTZlZTkiLCJpZCI6NjEwNTMsImlhdCI6MTYyNTY0ODgzN30.9B76dtOIBsNmX3laJ5VXFOqt2NlBT-n16j4ppUF8IYA";

    let viewer = new Cesium.Viewer("cesiumContainer", {
      // animation: false, //是否创建动画小器件，左下角仪表
      // baseLayerPicker: false, //是否显示图层选择器
      // fullscreenButton: false, //是否显示全屏按钮
      // geocoder: false, //是否显示geocoder小器件，右上角查询按钮
      // homeButton: false, //是否显示Home按钮
      // infoBox: false, //是否显示信息框
      // sceneModePicker: false, //是否显示3D/2D选择器
      // selectionIndicator: false, //是否显示选取指示器组件
      // timeline: false, //是否显示时间轴
      // navigationHelpButton: false, //是否显示右上角的帮助按钮
      // clock: new Cesium.Clock(), //用于控制当前时间的时钟对象
      imageryProvider: new Cesium.UrlTemplateImageryProvider({
        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      }),
      shouldAnimate: true,
      requestRenderMode: false,
      // terrainProvider: new Cesium.EllipsoidTerrainProvider(), //地形图层提供者，仅baseLayerPicker设为false有意义
      // fullscreenElement: document.body, //全屏时渲染的HTML元素,
      // useDefaultRenderLoop: true, //如果需要控制渲染循环，则设为true
      // targetFrameRate: undefined, //使用默认render loop时的帧率
      // showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
      // automaticallyTrackDataSourceClocks: true, //自动追踪最近添加的数据源的时钟设置
      contextOptions: {
        webgl: {
          alpha: true,
          depth: false,
          stencil: true,
          antialias: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: true,
        },
        allowTextureFilterAnisotropic: true,
      }, //传递给Scene对象的上下文参数（scene.options）
      // sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
      // mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系
      // dataSources: new Cesium.DataSourceCollection(), //需要进行可视化的数据源的集合
    });

    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(function (event) {
      // let ray = viewer.camera.getPickRay(event.position);
      // let position = viewer.scene.globe.pick(ray, viewer.scene);

      console.log(event);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 开启FPS渲染
    viewer.scene.debugShowFramesPerSecond = true;

    let d = getDistanceBetweenTwoPoints([113, 30, 113, 30.1]);
    console.log(d);

    this.cesiumViewer = viewer;
  },

  methods: {
    createPoint(earthPosition) {
      let entity = this.cesiumViewer.entities.add({
        id: "1",
        name: "点",
        position: earthPosition,
        point: {
          color: Cesium.Color.RED,
          pixelSize: 10,
        },
        label: {
          text: "eee",
          font: "14px",
        },
        properties: {},
      });

      this.cesiumViewer.zoomTo(entity);
    },

    // 截图功能
    handlerScreenShots() {
      let eleDom = document.getElementById("cesiumContainer");
      html2canvas(eleDom).then((canvas) => {
        document.body.appendChild(canvas);
      });
    },

    // 画线段
    handlerPolyline() {
      let cesiumViewer = this.cesiumViewer;
      const redLine = cesiumViewer.entities.add({
        name: "Red line on terrain.",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -75, 35, -125, 35, -155, 35,
          ]),
          width: 5,
          arcType: Cesium.ArcType.NONE,
          material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED),
          // clampToGround: true,
        },
      });

      const greenRhumbLine = cesiumViewer.entities.add({
        name: "Green rhumb line.",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            -75, 30, -125, 30, -155, 30,
          ]),
          width: 5,
          arcType: Cesium.ArcType.RHUMB,
          material: Cesium.Color.GREEN,
        },
      });

      const orangeOutlined = cesiumViewer.entities.add({
        name: "Orange line.",
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            -75, 39, 25000, -125, 39, 250000,
          ]),
          width: 5,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: Cesium.Color.ORANGE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
          }),
        },
      });

      // let flyline = this.parabola([-75, 39, -175, 39]);
      let flyline = getBSRxyz(-75, 39, -175, 45, 500000);

      console.log(flyline);
      var polyline = new Cesium.PolylineGeometry({
        positions: flyline,
        width: 2,
      });
      const instance = new Cesium.GeometryInstance({
        geometry: polyline,
        id: "flyline",
      });

      //添加至场景
      cesiumViewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: [instance],
          appearance: this.getFlylineMaterial(),
          releaseGeometryInstances: false,
          compressVertices: false,
        })
      );

      cesiumViewer.zoomTo(cesiumViewer.entities);
    },

    parabola(twoPoints) {
      //抛物线绘制
      let s = [];
      let startPoint = [twoPoints[0], twoPoints[1], 0]; //起点的经度、纬度
      s = s.concat(startPoint);
      let step = 80; //线的多少，越多则越平滑(但过多浏览器缓存也会占用越多)
      let heightProportion = 0.125; //最高点和总距离的比值
      let dLon = (twoPoints[2] - startPoint[0]) / step; //经度差值
      let dLat = (twoPoints[3] - startPoint[1]) / step; //纬度差值
      let deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1])); //经度差(米级)
      let deltaLat = dLat * 111000; //纬度差(米),1纬度相差约111000米
      let endPoint = [0, 0, 0]; //定义一个端点（后面将进行startPoint和endPoint两点画线）
      let heigh =
        (
          step *
          Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) *
          heightProportion
        ).toFixed(0) * 2;
      let x2 = 10000 * Math.sqrt(dLon * dLon + dLat * dLat); //小数点扩大10000倍，提高精确度
      let a = heigh / (x2 * x2);
      function y(x, height) {
        return height - a * x * x;
      }
      for (var i = 1; i <= step; i++) {
        //逐“帧”画线
        endPoint[0] = startPoint[0] + dLon; //更新end点经度
        endPoint[1] = startPoint[1] + dLat; //更新end点纬度
        let x = x2 * ((2 * i) / step - 1); //求抛物线函数x
        endPoint[2] = y(x, heigh).toFixed(0) * 1; //求end点高度
        s = s.concat(endPoint);

        // end点变为start点
        startPoint[0] = endPoint[0];
        startPoint[1] = endPoint[1];
        startPoint[2] = endPoint[2];
      }
      return Cesium.Cartesian3.fromDegreesArrayHeights(s);
    },
    getFlylineMaterial() {
      // 创建材质，在MaterialAppearance中若不添加基础材质，模型将会透明
      var material = new Cesium.Material.fromType("Color");
      material.uniforms.color = Cesium.Color.ORANGE;
      // 飞线效果-飞线间隔，宽度2
      let fragmentShaderSource = `         
                        varying vec2 v_st;    
                        varying float v_width;    
                        varying float v_polylineAngle;
                        varying vec4 v_positionEC;
                        varying vec3 v_normalEC;
                        void main()
                        {
                            vec2 st = v_st;
                            // 箭头飞线，宽度 8
                            float xx = fract(st.s*10.0 + st.t  - czm_frameNumber/60.0);
                            if (st.t<0.5) {
                                xx = fract(st.s*10.0 - st.t - czm_frameNumber/60.0);
                            }
                            float r = 0.0;
                            float g = xx;
                            float b = xx;
                            float a = xx;

                            // 飞线边框
                            if (st.t>0.8||st.t<0.2) {
                                g = 1.0;
                                b = 1.0;
                                a = 0.4;
                            }

                            gl_FragColor = vec4(r,g,b,a);
                        }

                `;
      // 自定义材质
      const aper = new Cesium.PolylineMaterialAppearance({
        material: material,
        translucent: true,
        vertexShaderSource: `
                        #define CLIP_POLYLINE 
                        void clipLineSegmentToNearPlane(
                            vec3 p0,
                            vec3 p1,
                            out vec4 positionWC,
                            out bool clipped,
                            out bool culledByNearPlane,
                            out vec4 clippedPositionEC)
                        {
                            culledByNearPlane = false;
                            clipped = false;
                            vec3 p0ToP1 = p1 - p0;
                            float magnitude = length(p0ToP1);
                            vec3 direction = normalize(p0ToP1);
                            float endPoint0Distance =  czm_currentFrustum.x + p0.z;
                            float denominator = -direction.z;
                            if (endPoint0Distance > 0.0 && abs(denominator) < czm_epsilon7)
                            {
                                culledByNearPlane = true;
                            }
                            else if (endPoint0Distance > 0.0)
                            {
                                float t = endPoint0Distance / denominator;
                                if (t < 0.0 || t > magnitude)
                                {
                                    culledByNearPlane = true;
                                }
                                else
                                {
                                    p0 = p0 + t * direction;
                                    p0.z = min(p0.z, -czm_currentFrustum.x);
                                    clipped = true;
                                }
                            }
                            clippedPositionEC = vec4(p0, 1.0);
                            positionWC = czm_eyeToWindowCoordinates(clippedPositionEC);
                        }
                        vec4 getPolylineWindowCoordinatesEC(vec4 positionEC, vec4 prevEC, vec4 nextEC, float expandDirection, float width, bool usePrevious, out float angle)
                        {
                            #ifdef POLYLINE_DASH
                            vec4 positionWindow = czm_eyeToWindowCoordinates(positionEC);
                            vec4 previousWindow = czm_eyeToWindowCoordinates(prevEC);
                            vec4 nextWindow = czm_eyeToWindowCoordinates(nextEC);
                            vec2 lineDir;
                            if (usePrevious) {
                                lineDir = normalize(positionWindow.xy - previousWindow.xy);
                            }
                            else {
                                lineDir = normalize(nextWindow.xy - positionWindow.xy);
                            }
                            angle = atan(lineDir.x, lineDir.y) - 1.570796327;
                            angle = floor(angle / czm_piOverFour + 0.5) * czm_piOverFour;
                            #endif
                            vec4 clippedPrevWC, clippedPrevEC;
                            bool prevSegmentClipped, prevSegmentCulled;
                            clipLineSegmentToNearPlane(prevEC.xyz, positionEC.xyz, clippedPrevWC, prevSegmentClipped, prevSegmentCulled, clippedPrevEC);
                            vec4 clippedNextWC, clippedNextEC;
                            bool nextSegmentClipped, nextSegmentCulled;
                            clipLineSegmentToNearPlane(nextEC.xyz, positionEC.xyz, clippedNextWC, nextSegmentClipped, nextSegmentCulled, clippedNextEC);
                            bool segmentClipped, segmentCulled;
                            vec4 clippedPositionWC, clippedPositionEC;
                            clipLineSegmentToNearPlane(positionEC.xyz, usePrevious ? prevEC.xyz : nextEC.xyz, clippedPositionWC, segmentClipped, segmentCulled, clippedPositionEC);
                            if (segmentCulled)
                            {
                                return vec4(0.0, 0.0, 0.0, 1.0);
                            }
                            vec2 directionToPrevWC = normalize(clippedPrevWC.xy - clippedPositionWC.xy);
                            vec2 directionToNextWC = normalize(clippedNextWC.xy - clippedPositionWC.xy);
                            if (prevSegmentCulled)
                            {
                                directionToPrevWC = -directionToNextWC;
                            }
                            else if (nextSegmentCulled)
                            {
                                directionToNextWC = -directionToPrevWC;
                            }
                            vec2 thisSegmentForwardWC, otherSegmentForwardWC;
                            if (usePrevious)
                            {
                                thisSegmentForwardWC = -directionToPrevWC;
                                otherSegmentForwardWC = directionToNextWC;
                            }
                            else
                            {
                                thisSegmentForwardWC = directionToNextWC;
                                otherSegmentForwardWC =  -directionToPrevWC;
                            }
                            vec2 thisSegmentLeftWC = vec2(-thisSegmentForwardWC.y, thisSegmentForwardWC.x);
                            vec2 leftWC = thisSegmentLeftWC;
                            float expandWidth = width * 0.5;
                            if (!czm_equalsEpsilon(prevEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1) && !czm_equalsEpsilon(nextEC.xyz - positionEC.xyz, vec3(0.0), czm_epsilon1))
                            {
                                vec2 otherSegmentLeftWC = vec2(-otherSegmentForwardWC.y, otherSegmentForwardWC.x);
                                vec2 leftSumWC = thisSegmentLeftWC + otherSegmentLeftWC;
                                float leftSumLength = length(leftSumWC);
                                leftWC = leftSumLength < czm_epsilon6 ? thisSegmentLeftWC : (leftSumWC / leftSumLength);
                                vec2 u = -thisSegmentForwardWC;
                                vec2 v = leftWC;
                                float sinAngle = abs(u.x * v.y - u.y * v.x);
                                expandWidth = clamp(expandWidth / sinAngle, 0.0, width * 2.0);
                            }
                            vec2 offset = leftWC * expandDirection * expandWidth * czm_pixelRatio;
                            return vec4(clippedPositionWC.xy + offset, -clippedPositionWC.z, 1.0) * (czm_projection * clippedPositionEC).w;
                        }
                        vec4 getPolylineWindowCoordinates(vec4 position, vec4 previous, vec4 next, float expandDirection, float width, bool usePrevious, out float angle)
                        {
                            vec4 positionEC = czm_modelViewRelativeToEye * position;
                            vec4 prevEC = czm_modelViewRelativeToEye * previous;
                            vec4 nextEC = czm_modelViewRelativeToEye * next;
                            return getPolylineWindowCoordinatesEC(positionEC, prevEC, nextEC, expandDirection, width, usePrevious, angle);
                        }

                        attribute vec3 position3DHigh;
                        attribute vec3 position3DLow;
                        attribute vec3 prevPosition3DHigh;
                        attribute vec3 prevPosition3DLow;
                        attribute vec3 nextPosition3DHigh;
                        attribute vec3 nextPosition3DLow;
                        attribute vec2 expandAndWidth;
                        attribute vec2 st;
                        attribute float batchId;

                        varying float v_width;
                        varying vec2 v_st;
                        varying float v_polylineAngle;
                        
                        varying vec4 v_positionEC;
                        varying vec3 v_normalEC;
                        void main()
                        {
                        float expandDir = expandAndWidth.x;
                        float width = abs(expandAndWidth.y) + 0.5;
                        bool usePrev = expandAndWidth.y < 0.0;

                        vec4 p = czm_computePosition();
                        vec4 prev = czm_computePrevPosition();
                        vec4 next = czm_computeNextPosition();
                        
                        float angle;
                        vec4 positionWC = getPolylineWindowCoordinates(p, prev, next, expandDir, width, usePrev, angle);
                        gl_Position = czm_viewportOrthographic * positionWC;
                        
                        v_width = width;
                        v_st.s = st.s;
                        v_st.t = st.t;
                        // v_st.t = czm_writeNonPerspective(st.t, gl_Position.w);
                        v_polylineAngle = angle;


                        
                        vec4 eyePosition = czm_modelViewRelativeToEye * p;
                        v_positionEC =  czm_inverseModelView * eyePosition;      // position in eye coordinates
                        //v_normalEC = czm_normal * normal;                         // normal in eye coordinates
                        }

                    `,
        fragmentShaderSource: fragmentShaderSource,
      });
      return aper;
    },
  },
};
</script>

<style lang="scss" scoped>
.cesium {
  width: 100%;
  height: 100%;
}
</style>
