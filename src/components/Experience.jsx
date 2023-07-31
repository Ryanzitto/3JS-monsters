import {
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  useTexture,
  Text,
  CameraControls,
  useCursor,
} from "@react-three/drei";
import * as THREE from "three";
import { Fish } from "./Fish";
import { Dragon } from "./Dragon";
import { Cactoro } from "./Cactoro";
import { useState, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState();
  useCursor(hovered);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);
  return (
    <>
      <ambientLight intensity={1} />
      <Environment preset="sunset" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <MonsterStage
        texture="textures/water.jpg"
        name="Fish"
        color="#3d5a80"
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Fish scale={0.5} position-y={-1} hovered={hovered === "Fish"} />
      </MonsterStage>
      <MonsterStage
        texture="textures/lava.jpg"
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        name="Draco"
        color="#df8d52"
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Dragon scale={0.5} position-y={-1} hovered={hovered === "Draco"} />
      </MonsterStage>
      <MonsterStage
        texture="textures/cactus.jpg"
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        name="Cactos"
        color="#739d3c"
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Cactoro scale={0.45} position-y={-1} hovered={hovered === "Cactos"} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });
  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
        anchorY={"bottom"}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>

      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => {
          setActive(active === name ? null : name);
        }}
        onPointerEnter={() => {
          setHovered(name);
        }}
        onPointerLeave={() => setHovered(null)}
      >
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
