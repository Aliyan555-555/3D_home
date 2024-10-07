import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
export const UserCurrentPosition = [
    {
      top: '100px',
      left: '100px',
    },
    {
      top: '120px',
      left: '80px',
    },
    {
      top: '130px',
      left: '120px',
    },
    {
      top: '90px',
      left: '120px',
    },
    {
      top: '60px',
      left: '120px',
    },
    {
      top: '100px',
      left: 'px',
    },
    {
      top: '60px',
      left: '100px',
    },
    {
      top: '25px',
      left: '70px',
    },
    {
      top: '20px',
      left: '155px',
    },
    {
      top: '50px',
      left: '155px',
    },
  ];


  export const footPrintDatas = {
    1: [
      { position: new BABYLON.Vector3(0, -300, 0), rotation: 1, size: 100, point: 1 },
      { position: new BABYLON.Vector3(460, -260, 0), rotation: 0, size: 80, point: 2 },
      { position: new BABYLON.Vector3(460, -240, 330), rotation: 0, size: 80, point: 3 },
    ],
    2: [
      { position: new BABYLON.Vector3(-460, -300, 0), rotation: 1, size: 100, point: 1 },
      { position: new BABYLON.Vector3(0, -360, 0), rotation: 0, size: 100, point: 2 },
      { position: new BABYLON.Vector3(0, -360, 450), rotation: 0, size: 100, point: 3 },
      { position: new BABYLON.Vector3(10, -180, 460), rotation: 0, size: 60, point: 4 },
      { position: new BABYLON.Vector3(10, -110, 460), rotation: 0, size: 30, point: 6 },
    ],
    3: [
      { position: new BABYLON.Vector3(-460, -300, -370), rotation: 1, size: 100, point: 1 },
      { position: new BABYLON.Vector3(0, -360, -450), rotation: 0, size: 100, point: 2 },
      { position: new BABYLON.Vector3(0, -360, 0), rotation: 0, size: 100, point: 3 },
      { position: new BABYLON.Vector3(10, -360, 460), rotation: 0, size: 90, point: 4 },
      { position: new BABYLON.Vector3(10, -160, 460), rotation: 0, size: 50, point: 6 },
    ],
    4: [
      // { position: new BABYLON.Vector3(-460, -300, -370), rotation: 1, size: 100, point: 1 },
      { position: new BABYLON.Vector3(0, -200, -460), rotation: 0, size: 70, point: 2 },
      { position: new BABYLON.Vector3(0, -360, -460), rotation: 0, size: 100, point: 3 },
      { position: new BABYLON.Vector3(10, -360, 0), rotation: 0, size: 90, point: 4 },
      { position: new BABYLON.Vector3(-410, -360, 0), rotation: 0, size: 90, point: 5 },
      { position: new BABYLON.Vector3(10, -320, 460), rotation: 0, size: 100, point: 6 },
    ],
    5: [
      { position: new BABYLON.Vector3(0, -360, 0), rotation: 0, size: 100, point: 5 },
    ],
    6: [
      { position: new BABYLON.Vector3(0, -120, -460), rotation: Math.PI, size: 40, point: 2 },
      { position: new BABYLON.Vector3(0, -180, -460), rotation: Math.PI, size: 70, point: 3 },
      { position: new BABYLON.Vector3(10, -300, -460), rotation: Math.PI, size: 100, point: 4 },
      { position: new BABYLON.Vector3(10, -320, 0), rotation: Math.PI, size: 100, point: 6 }, 
      { position: new BABYLON.Vector3(410, -320, 0), rotation: Math.PI, size: 100, point: 8 }, 
      { position: new BABYLON.Vector3(-460, -300, -80), rotation: 0, size: 100, point: 7}, 
    ],
    7: [
      { position: new BABYLON.Vector3(0, -320, 0), rotation: 0, size: 100, point: 7 }, 
      { position: new BABYLON.Vector3(460, -250, 70), rotation: Math.PI, size: 90, point: 6 }, 
      { position: new BABYLON.Vector3(460, -150, 50), rotation: Math.PI, size: 60, point: 8 }, 
    ],

    8: [
      { position: new BABYLON.Vector3(0, -360, 0), rotation: Math.PI, size: 100, point: 8 }, 
      { position: new BABYLON.Vector3(0, -360, -290), rotation: Math.PI, size: 100, point: 9 }, 
      { position: new BABYLON.Vector3(-460, -440, -10), rotation: Math.PI, size: 100, point: 6 }, 
      { position: new BABYLON.Vector3(-460, -150, -30), rotation: 0, size: 50, point: 7 }, 
    ],
    9: [
      { position: new BABYLON.Vector3(0, -360, 0), rotation: 0, size: 100, point: 9 }, 
      { position: new BABYLON.Vector3(0, -360, 340), rotation: 0, size: 100, point: 8 }, 
    ],
  };


export const Prototype = [
  {
    width:360,
    height:150,
    type:'wall',
    x:0,
    y:0,
    z:0,
    point:1, 
  }
]