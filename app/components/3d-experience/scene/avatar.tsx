import { useEffect, useRef, useState } from 'react';

import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { AnimationAction, AnimationClip, AnimationMixer, Bone, Group, MeshStandardMaterial, SkinnedMesh } from 'three';
// Some environments need an explicit import for the examples loaders. If
// your TypeScript setup doesn't include the type declarations for
// 'three/examples/jsm', you can add them to `types` or use an import like
// below — TS may still complain in your environment and you can install
// '@types/three' or adjust `tsconfig` accordingly.
// We'll dynamically import FBXLoader inside the effect to avoid static
// type/import issues across different TS configurations.
import type { GLTF } from 'three-stdlib';
import avatarModel from '~/assets/models/avatar/avatar.glb';

type AvatarGLTFResult = GLTF & {
  nodes: {
    Hips: Bone;
    EyeLeft: SkinnedMesh;
    EyeRight: SkinnedMesh;
    Wolf3D_Head: SkinnedMesh;
    Wolf3D_Teeth: SkinnedMesh;
    Wolf3D_Glasses: SkinnedMesh;
    Wolf3D_Body: SkinnedMesh;
    Wolf3D_Outfit_Bottom: SkinnedMesh;
    Wolf3D_Outfit_Footwear: SkinnedMesh;
    Wolf3D_Outfit_Top: SkinnedMesh;
  };
  materials: {
    Wolf3D_Eye: MeshStandardMaterial;
    Wolf3D_Skin: MeshStandardMaterial;
    Wolf3D_Teeth: MeshStandardMaterial;
    Wolf3D_Glasses: MeshStandardMaterial;
    Wolf3D_Body: MeshStandardMaterial;
    Wolf3D_Outfit_Bottom: MeshStandardMaterial;
    Wolf3D_Outfit_Footwear: MeshStandardMaterial;
    Wolf3D_Outfit_Top: MeshStandardMaterial;
  };
};

type AvatarProps = ThreeElements['group'] & {
  animation: string;
};

export function Avatar(props: AvatarProps) {
  const avatarGroup = useRef<Group | null>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const currentAction = useRef<AnimationAction | null>(null);

  const { nodes, materials } = useGLTF(avatarModel) as unknown as AvatarGLTFResult;
  const { animation, ...rest } = props;

  // Use Vite's import.meta.glob to bundle FBX animation files from the assets
  // directory so we can reference them dynamically by name at runtime. The
  // { as: 'url' } option makes resolvers return a Promise<string> URL.
  // Note: Vite deprecated `as: 'url'` in favour of `query: '?url', import: 'default'`.
  // Use the new options and keep the resolver tolerant to either a string or
  // a module with a `default` export to remain compatible with different
  // toolchain typings.
  const animationsImportMap = import.meta.glob('../../../assets/models/avatar/animations/*.fbx', {
    query: '?url',
    import: 'default',
  }) as Record<string, () => Promise<unknown>>;

  const [resolvedAnimationUrl, setResolvedAnimationUrl] = useState<string | null>(null);

  // Resolve the animation URL from the import map when `animation` changes.
  // We look for an entry that ends with the requested filename; otherwise use
  // the first file in the folder as a graceful fallback.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const name = `${animation}.fbx`;
      const entries = Object.keys(animationsImportMap);
      const match = entries.find((p) => p.endsWith(`/${name}`) || p.endsWith(name));
      try {
        if (match) {
          const maybe = await animationsImportMap[match]();
          let url: string | undefined;
          if (typeof maybe === 'string') url = maybe;
          else if (maybe && typeof maybe === 'object') {
            const mod = maybe as { default?: unknown };
            if (typeof mod.default === 'string') url = mod.default;
          }
          if (mounted) setResolvedAnimationUrl(url ?? null);
          return;
        }

        if (entries.length > 0) {
          const maybe = await animationsImportMap[entries[0]]();
          let url: string | undefined;
          if (typeof maybe === 'string') url = maybe;
          else if (maybe && typeof maybe === 'object') {
            const mod = maybe as { default?: unknown };
            if (typeof mod.default === 'string') url = mod.default;
          }
          if (mounted) setResolvedAnimationUrl(url ?? null);
          return;
        }

        if (mounted) setResolvedAnimationUrl(null);
      } catch {
        // If resolution fails, clear the url so useFBX gets an empty string
        if (mounted) setResolvedAnimationUrl(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [animation, animationsImportMap]);

  // useFBX expects a URL string. If the URL isn't resolved yet, pass an empty
  // string so it doesn't try to fetch a non-bundled runtime path.
  const [verifiedLoaderUrl, setVerifiedLoaderUrl] = useState<string>('');
  const [validatedArrayBuffer, setValidatedArrayBuffer] = useState<ArrayBuffer | null>(null);

  // Validate the resolved animation URL by fetching the resource and
  // checking for an FBX-like signature. If valid, create a blob URL and pass
  // that to the loader. This prevents FBXLoader from receiving an HTML 404
  // page (which causes "Cannot find the version number" errors).
  useEffect(() => {
    let mounted = true;
    // no created blob url anymore; we keep the validated ArrayBuffer

    async function validateAndCreate(url: string | null) {
      if (!url) {
        if (mounted) setVerifiedLoaderUrl('');
        return;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error('Failed to fetch animation URL', url, res.status);
          if (mounted) setVerifiedLoaderUrl('');
          return;
        }

        const buf = await res.arrayBuffer();
        // Inspect first 128 bytes for common FBX signatures.
        const header = new TextDecoder('utf-8').decode(buf.slice(0, 128));
        const looksLikeFBX = header.includes('Kaydara') || header.includes('FBX');

        if (!looksLikeFBX) {
          // Dump a small hex preview to help debugging what we actually fetched
          const bytes = new Uint8Array(buf.slice(0, 64));
          const hex = Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' ');
          console.error('Resolved animation does not look like an FBX file:', url, {
            status: res.status,
            headerPreview: header,
            hexPreview: hex,
          });
          if (mounted) setVerifiedLoaderUrl('');
          return;
        }

        // Keep the ArrayBuffer itself so we can parse it directly with
        // FBXLoader.parse and avoid letting the loader perform another fetch
        // (which can produce HTML 404 responses that confuse the parser).
        if (mounted) {
          setValidatedArrayBuffer(buf);
          setVerifiedLoaderUrl('valid');
        }
      } catch (e) {
        console.error('Error validating animation file', e);
        if (mounted) setVerifiedLoaderUrl('');
      }
    }

    validateAndCreate(resolvedAnimationUrl);

    return () => {
      mounted = false;
      // clear validated buffer on unmount/resolution change
      setValidatedArrayBuffer(null);
      setVerifiedLoaderUrl('');
    };
  }, [resolvedAnimationUrl]);

  // Load the FBX using FBXLoader.parse when we have the validated ArrayBuffer.
  // This avoids extra network requests and ensures the parser receives raw
  // FBX bytes.
  const [loadedFbx, setLoadedFbx] = useState<Group | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!validatedArrayBuffer) return;

    (async () => {
      try {
        // Type for the loader we will use (parse method accepts ArrayBuffer)
        type LoaderLike = {
          parse: (buffer: ArrayBuffer, path?: string) => Group;
        } & {
          new (): LoaderLike;
        };

        // @ts-expect-error - examples module may not have types in this TS config
        const mod = (await import('three/examples/jsm/loaders/FBXLoader')) as unknown as { FBXLoader: LoaderLike };
        const Loader = mod.FBXLoader;
        const loader = new Loader();
        // Parse the validated ArrayBuffer. If parsing fails, log diagnostics
        // (hex preview) to help troubleshoot what was actually fetched.
        try {
          const parsed = loader.parse(validatedArrayBuffer as ArrayBuffer, '');
          if (mounted) setLoadedFbx(parsed as Group);
        } catch (firstErr) {
          const bytes = new Uint8Array((validatedArrayBuffer as ArrayBuffer).slice(0, 128));
          const hex = Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' ');
          console.error('FBXLoader.parse failed. Diagnostics:', {
            firstError: firstErr,
            hexPreview: hex,
          });
          if (mounted) setLoadedFbx(null);
        }
      } catch (e) {
        console.error('Failed to dynamically import/parse FBXLoader', e);
        if (mounted) setLoadedFbx(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [validatedArrayBuffer]);

  useEffect(() => {
    const animations = (loadedFbx as unknown as { animations?: AnimationClip[] })?.animations || [];
    if (!avatarGroup.current || animations.length === 0) {
      return;
    }

    if (!mixer.current) {
      mixer.current = new AnimationMixer(avatarGroup.current);
    }

    const newAction = mixer.current.clipAction(animations[0] as AnimationClip);

    if (currentAction.current) {
      currentAction.current.crossFadeTo(newAction, 0.5, true);
    } else {
      newAction.fadeIn(0.5).play();
    }

    currentAction.current = newAction;
    newAction.reset().play();

    // NOTE: don't stop the mixer or clear currentAction here because this
    // effect runs on every animation change and we want the previous action
    // to remain active until the new action is ready so cross-fades are
    // smooth. The mixer is cleaned up on component unmount below.
  }, [loadedFbx, verifiedLoaderUrl, animation]);

  // Ensure we stop mixer and actions when the Avatar component unmounts.
  useEffect(() => {
    return () => {
      mixer.current?.stopAllAction();
      mixer.current = null;
      currentAction.current = null;
    };
  }, []);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group name="Armature" ref={avatarGroup} {...rest}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  );
}

useGLTF.preload(avatarModel);
