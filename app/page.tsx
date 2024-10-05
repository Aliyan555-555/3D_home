"use client";
import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
import Image from 'next/image';

interface FootprintInterface {
  position: BABYLON.Vector3;
  rotation: number;
  size: number;
  point: number;
}

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  let footprints: BABYLON.Mesh[] = [];
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [currentPoint, setCurrentPoint] = useState(2); // State to keep track of the current navigation point
  const [initialLoading, setInitialLoading] = useState(true); // State to manage initial loading
  const [navigationLoading, setNavigationLoading] = useState(false); // State to manage navigation loading
  const [cameraPosition, setCameraPosition] = useState({ x: 0, z: 0 }); // State to manage camera position for the mini-map
  const footprintData: { [key: number]: FootprintInterface[] } = {
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

    
 
  const moveCameraToFootprint = (footprint: FootprintInterface) => {
    if (!sceneRef.current) return;

    // Animate the camera to move to the footprint position
    const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
    
    // Define the target position based on the footprint
    const targetPosition = footprint.position.add(new BABYLON.Vector3(0, 10, 0)); // Move slightly above the footprint

    // Create an animation for smooth movement
    const cameraAnimation = new BABYLON.Animation(
      "cameraAnimation",
      "position",
      30, // Frame rate
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const keys = [
      { frame: 0, value: camera.position }, // Starting position
      { frame: 30, value: targetPosition }, // Target position
    ];

    cameraAnimation.setKeys(keys);
    camera.animations.push(cameraAnimation);

    // Start the animation
    sceneRef.current.beginAnimation(camera, 0, 30, false, 1, () => {
      // After camera movement is complete, change the point
      setCurrentPoint(footprint.point);
    });
  };


  const addFootprints = (scene: BABYLON.Scene | undefined, point: number) => {
    console.log("update point",point)
    if (!scene) return;

    // Dispose of existing footprints
    footprints.forEach((mesh) => mesh.dispose());
    footprints = []; // Clear the footprints array
    if (footprints.length > 0){
      footprints = []
    }

    const footprintsData = footprintData[point] || [];
    const footprintTexture = new BABYLON.Texture("/images/UI/hotspot_goto.png", scene);

    footprintsData.forEach((footprint) => {
      const footprintMesh = BABYLON.MeshBuilder.CreatePlane("footprint", { size: footprint.size }, scene);
      footprintMesh.position = footprint.position;
      footprintMesh.rotation.y = footprint.rotation;
      footprintMesh.rotation.x = Math.PI / 2;

      const footprintMaterial = new BABYLON.StandardMaterial("footprintMaterial", scene);
      footprintMaterial.diffuseTexture = footprintTexture;
      footprintMaterial.opacityTexture = footprintTexture;
      footprintMaterial.backFaceCulling = false;
      footprintMesh.material = footprintMaterial;

      footprintMesh.actionManager = new BABYLON.ActionManager(scene);
      footprintMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
          setCurrentPoint(footprint.point);
          moveCameraToFootprint(footprint)
        })
      );

      footprints.push(footprintMesh); // Add footprint mesh to the array
    });
  };
  const createScene = () => {
    const scene = new BABYLON.Scene(engineRef.current!);

    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 110, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current!, true);
    camera.inputs.attached.mousewheel.detachControl();

    camera.inertia = 0.5;
    camera.angularSensibilityX = 300;
    camera.angularSensibilityY = 300;
    camera.wheelDeltaPercentage = -1;

    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5;

    const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -1, 0), scene);
    light.position = new BABYLON.Vector3(0, 10, 0);
    light.intensity = 1;

    const placeholderSkybox = BABYLON.MeshBuilder.CreateBox("placeholderSkyBox", { size: 1000.0 }, scene);
    const placeholderSkyboxMaterial = new BABYLON.StandardMaterial("placeholderSkyBox", scene);
    placeholderSkyboxMaterial.backFaceCulling = false;
    placeholderSkyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    placeholderSkyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    placeholderSkybox.material = placeholderSkyboxMaterial;

    scene.registerBeforeRender(() => {
      const cameraPosition = camera.position;
      setCameraPosition({ x: cameraPosition.x, z: cameraPosition.z });
    });

    addFootprints(scene, currentPoint);
  
    return scene;
  };

  const loadPanoramaImages = async (point: number) => {
    setNavigationLoading(true);
    const folderPath = `images/point${point}/`;

    // const textureUrls:string[] = [
    //   `${folderPath}_px.jpg`,
    //   `${folderPath}_nx.jpg`,
    //   `${folderPath}_py.jpg`,
    //   `${folderPath}_ny.jpg`,
    //   `${folderPath}_pz.jpg`,
    //   `${folderPath}_nz.jpg`,
    // ];

    // await Promise.all(
    //   textureUrls.map(url => {
    //     return new Promise<void>((resolve, reject) => {
    //       const img = new window.Image(); // Fix for Image
    //       img.src = url;
    //       img.onload = () => resolve();
    //       img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    //     });
    //   })
    // );

    const cubeTexture = new BABYLON.CubeTexture(folderPath, sceneRef.current!, ["_px.jpg", "_nx.jpg", "_py.jpg", "_ny.jpg", "_pz.jpg", "_nz.jpg"]);

    await new Promise<void>((resolve) => {
      cubeTexture.onLoadObservable.add(() => {
        resolve();
      });
    });

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, sceneRef.current!);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", sceneRef.current!);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = await cubeTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    setNavigationLoading(false);
    return skybox;
  };

  useEffect(() => {
    engineRef.current = new BABYLON.Engine(canvasRef.current!, true);
    sceneRef.current = createScene();

    loadPanoramaImages(currentPoint).then(() => {
      setInitialLoading(false);
    }).catch((error) => {
      console.log(error);
    });

    engineRef.current.runRenderLoop(() => {
      sceneRef.current!.render();
    });

    window.addEventListener("resize", () => {
      engineRef.current!.resize();
    });

    return () => {
      window.removeEventListener("resize", () => engineRef.current!.resize());
      engineRef.current!.dispose();
    };
  }, [currentPoint]);

  useEffect(() => {
    if (sceneRef.current && !initialLoading) {
      sceneRef.current.meshes.forEach((mesh) => {
        if (mesh.name === "skyBox" || mesh.name === "footprint") {
          mesh.dispose();
        }
      });

      loadPanoramaImages(currentPoint);
      addFootprints(sceneRef.current, currentPoint);
    }
  }, [currentPoint]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
      {initialLoading && (
        <div className="w-screen h-screen fixed top-0 left-0">
          <Image
            width={500}
            height={500}
            className={"w-screen object-cover h-screen"}
            src="/images/UI/splashscreen.jpg"
            alt="splashscreen"
          />
        </div>
      )}
      {navigationLoading && (
        <div
        className="fixed top-0 flex items-center justify-center left-0 w-screen bg-no-repeat bg-cover h-screen"
        style={{ backgroundImage: `url(/images/UI/splashscreen.jpg)` }}
      >
        <Image
          width={50}
          height={50}
          className="animate-spin"
          src="/images/UI/loading.png"
          alt="LOADING"
        />
      </div>
      )}
      {!initialLoading && !navigationLoading && (
        <MiniMap
        setPoint={(data)=>setCurrentPoint(data)}
        url={'/images/UI/minimap.png'}
        cursor="/images/UI/user.png"
        offsetX={0}
        offsetY={0}
        scale={1}
        point={currentPoint}
        currentPosition={cameraPosition}
      />
      )}
    </div>
  );
};

export default BabylonScene;


interface MiniMapProps {
  url: string;
  setPoint:(data:number) => void;
  cursor: string;
  currentPosition: { x: number; z: number };
  scale?: number;
  offsetX?: number;
  point:number;
  offsetY?: number;
}
interface MiniMapState {
  transform:string;
}
// interface MiniMapProps {
//   url: string;
//   cursor: string;
//   setPoint: (point: number) => void;
//   currentPosition: { x: number; z: number };
//   point: number;
// }

// interface MiniMapState {
//   transform: string;
// }

const MiniMap: React.FC<MiniMapProps> = ({
  url,
  cursor,
  setPoint,
  currentPosition,
  point,
}) => {
  const miniMapRef = useRef<HTMLDivElement | null>(null);
  const [miniMapStyle, setMiniMapStyle] = useState<MiniMapState>({
    transform: 'rotate(0rad)',
  });

  useEffect(() => {
    if (miniMapRef.current) {
      const { transform } = calculateMiniMapPosition(currentPosition);
      setMiniMapStyle({ transform: transform });
    }
  }, [currentPosition]);

  const calculateMiniMapPosition = (position: { x: number; z: number }) => {
    // Calculate the angle of rotation based on the position
    const angle = Math.atan2(position.z, position.x); // Use atan2 for correct angle calculation
    const adjustedAngle = angle + angle / 2; // Adjust the angle
    return {
      transform: `rotate(${-adjustedAngle}rad)`,
    };
  };

  const UserCurrentPosition = [
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

  const changeFloor = (newFloor: number) => {
    setPoint(newFloor);
  };

  return (
    <div
      ref={miniMapRef}
      style={{
        position: 'fixed',
        width: '220px',
        height: '220px',
        backgroundSize: 'cover',
        right: '10px',
        bottom: '10px',
      }}
      className={'p-4 bg-[#0005]'}
    >
      <Image
        className={'w-full h-full object-cover'}
        src={url}
        alt="MAP"
        width={100}
        height={100}
      />
      <div
        style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          backgroundImage: `url(${cursor})`,
          backgroundSize: 'cover',
          top: UserCurrentPosition[point].top,
          left: UserCurrentPosition[point].left,
          ...miniMapStyle,
        }}
        className={`transition-transform duration-500`}
      ></div>
      <div>
        <button onClick={() => changeFloor(1)}>Floor 1</button>
        <button onClick={() => changeFloor(2)}>Floor 2</button>
      </div>
    </div>
  );
};

