/* * Chromakey Shader - High Quality Smoothness
 * https://github.com/nikolaiwarner/aframe-chromakey-material
 */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerShader('chromakey-custom', {
  schema: {
    src: { type: 'map', is: 'uniform' },
    color: { type: 'vec3', default: { x: 0.1, y: 0.9, z: 0.2 }, is: 'uniform' },
    transparent: { default: true, is: 'uniform' },
    tolerance: { type: 'float', default: 0.1, is: 'uniform' },
    smoothness: { type: 'float', default: 0.1, is: 'uniform' }
  },

  init: function (data) {
    var videoTexture = new THREE.VideoTexture(data.src);

    // --- FIX 1: FILTRI ALTA QUALITÀ ANTIALIASING ---
    // LinearFilter sfuma i pixel quando sono vicini (Mag) o lontani (Min)
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    
    // --- FIX 2: ANISOTROPIA (Cruciale per AR) ---
    // Rende i bordi nitidi ma lisci anche quando il marker è inclinato
    var sceneEl = this.el.sceneEl;
    if (sceneEl.renderer) {
        var maxAnisotropy = sceneEl.renderer.capabilities.getMaxAnisotropy();
        videoTexture.anisotropy = maxAnisotropy;
    }
    
    // Evita che la texture si ripeta ai bordi creando linee strane
    videoTexture.wrapS = THREE.ClampToEdgeWrapping;
    videoTexture.wrapT = THREE.ClampToEdgeWrapping;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { type: 'c', value: new THREE.Color(data.color.x, data.color.y, data.color.z) },
        myTexture: { type: 't', value: videoTexture },
        tolerance: { type: 'f', value: data.tolerance },
        smoothness: { type: 'f', value: data.smoothness }
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: data.transparent,
      depthWrite: false // Importante per evitare glitch di ordinamento trasparenza
    });
  },

  update: function (data) {
    this.material.uniforms.color.value.setRGB(data.color.x, data.color.y, data.color.z);
    this.material.uniforms.tolerance.value = data.tolerance;
    this.material.uniforms.smoothness.value = data.smoothness;
    this.material.transparent = data.transparent;
    
    if (data.src && this.material.uniforms.myTexture.value.image !== data.src) {
        // Riapplica i filtri se cambia il video
        var newTex = new THREE.VideoTexture(data.src);
        newTex.minFilter = THREE.LinearFilter;
        newTex.magFilter = THREE.LinearFilter;
        newTex.wrapS = THREE.ClampToEdgeWrapping;
        newTex.wrapT = THREE.ClampToEdgeWrapping;
        // Ri-applica anisotropia
        var sceneEl = this.el.sceneEl;
        if (sceneEl.renderer) {
            newTex.anisotropy = sceneEl.renderer.capabilities.getMaxAnisotropy();
        }
        this.material.uniforms.myTexture.value = newTex;
    }
  },

  vertexShader: [
    'varying vec2 vUv;',
    'void main(void)',
    '{',
    '  vUv = uv;',
    '  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
    '  gl_Position = projectionMatrix * mvPosition;',
    '}'
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D myTexture;',
    'uniform vec3 color;',
    'uniform float tolerance;',
    'uniform float smoothness;',
    'varying vec2 vUv;',
    
    'void main(void)',
    '{',
    '  vec4 textureColor = texture2D( myTexture, vUv );',
    '  vec3 tColor = textureColor.rgb;',
    
    '  float dist = length(tColor - color);',
    
    // Calcolo Alpha originale
    '  float alpha = smoothstep(tolerance, tolerance + smoothness, dist);',
    
    // --- FIX 3: GAMMA CORRECTION SU ALPHA ---
    // Questo ammorbidisce ulteriormente la curva di trasparenza
    // Riduce l\'effetto "taglio netto"
    '  alpha = pow(alpha, 1.2);',

    // Anti-Halo (Darkening)
    '  vec3 finalColor = tColor * alpha;', 

    '  gl_FragColor = vec4(finalColor, alpha * textureColor.a);',
    '}'
  ].join('\n')
});