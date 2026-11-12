(function () {
  'use strict';

  if (window.OMS) {
    console.warn('[OMS] Core already initialized');
    return;
  }

  const EDITOR_KEY = 'openmapstudio.editor.v4';
  const REACT_KEY = 'openmap-studio-project-v2';
  const readyCallbacks = [];
  let connected = false;

  function editorApi() {
    return window.__OPENMAP_EDITOR_V4__ || null;
  }

  function editorState() {
    return editorApi()?.state || null;
  }

  function whenReady(callback) {
    if (connected && editorApi()) {
      callback(window.OMS);
      return;
    }
    readyCallbacks.push(callback);
  }

  const OMS = {
    version: '2.0.0',
    phase: '3UI-C',
    architecture: 'persistent-palette-opacity-strokes',
    storage: {
      canonicalKey: EDITOR_KEY,
      legacyReactKey: REACT_KEY
    },
    ready: whenReady,
    editor: {
      get api() { return editorApi(); },
      get state() { return editorState(); },
      isReady() { return !!editorApi(); },
      setTool(tool) {
        const api = editorApi();
        if (!api?.setTool) throw new Error('[OMS] Editor V4 setTool is unavailable');
        return api.setTool(tool);
      },
      undo() {
        const api = editorApi();
        if (!api?.undo) throw new Error('[OMS] Editor V4 undo is unavailable');
        return api.undo();
      },
      redo() {
        const api = editorApi();
        if (!api?.redo) throw new Error('[OMS] Editor V4 redo is unavailable');
        return api.redo();
      },
      getSelection() { return editorApi()?.selectedId || null; },
      select(id) { const api=editorApi(); if(!api?.select) throw new Error('[OMS] Select API unavailable'); return api.select(id); },
      clearSelection() { return editorApi()?.clearSelection?.(); },
      deleteSelected() { return editorApi()?.deleteSelected?.(); },
      nudge(direction, pixels=1) { return editorApi()?.nudgeSelected?.(direction,pixels); },
      qa() {
        const api = editorApi();
        if (!api?.qa) throw new Error('[OMS] Editor V4 QA is unavailable');
        return api.qa();
      }
    },
    project: {
      getState() { return editorState(); },
      getObjects() {
        const objects = editorState()?.objects;
        return Array.isArray(objects) ? objects : [];
      },
      getLayers() {
        const layers = editorState()?.layers;
        return Array.isArray(layers) ? layers : [];
      },
      getObject(id) {
        return this.getObjects().find(object => object?.id === id) || null;
      },
      getLayer(id) {
        return this.getLayers().find(layer => layer?.id === id) || null;
      },
      save() {
        const api = editorApi();
        if (!api?.save) throw new Error('[OMS] Editor V4 save is unavailable');
        return api.save();
      },
      load() {
        const api = editorApi();
        if (!api?.load) throw new Error('[OMS] Editor V4 load is unavailable');
        return api.load();
      },
      exportGeoJSON() {
        const api = editorApi();
        if (!api?.exportGeoJSON) throw new Error('[OMS] Editor V4 GeoJSON export is unavailable');
        return api.exportGeoJSON();
      },
      exportPNG() {
        const api = editorApi();
        if (!api?.exportPNG) throw new Error('[OMS] Editor V4 PNG export is unavailable');
        return api.exportPNG();
      }
    },
    diagnostics() {
      const root = document.getElementById('root');
      const state = editorState();
      const reactRaw = localStorage.getItem(REACT_KEY) || '';
      let reactObjects = null;
      try {
        const parsed = JSON.parse(reactRaw);
        reactObjects = Array.isArray(parsed?.objects) ? parsed.objects.length : 0;
      } catch {
        reactObjects = null;
      }
      return {
        version: this.version,
        phase: this.phase,
        architecture: this.architecture,
        appRootPresent: !!root,
        appRendered: !!(root && root.childElementCount),
        mapPersistence: !!window.__OPENMAP_MAP_PERSISTENCE__,
        mapConnected: !!window.__OPENMAP_MAP_PERSISTENCE__?.map,
        editorV4: !!editorApi(),
        editorConnected: connected,
        canonicalStorageKey: EDITOR_KEY,
        canonicalObjectCount: Array.isArray(state?.objects) ? state.objects.length : 0,
        canonicalLayerCount: Array.isArray(state?.layers) ? state.layers.length : 0,
        legacyReactObjectCount: reactObjects,
        duplicateReactObjectsDetected: typeof reactObjects === 'number' && reactObjects > 0,
        buttonAudit: !!window.__OPENMAP_BUTTON_AUDIT__
      };
    }
  };

  window.OMS = OMS;

  function connect() {
    if (connected || !editorApi()) return false;
    connected = true;
    window.dispatchEvent(new CustomEvent('oms:editorready', {
      detail: {
        phase: OMS.phase,
        objectCount: OMS.project.getObjects().length,
        layerCount: OMS.project.getLayers().length
      }
    }));
    while (readyCallbacks.length) {
      const callback = readyCallbacks.shift();
      try { callback(OMS); } catch (error) { console.error('[OMS] ready callback failed', error); }
    }
    console.log('[OMS] Editor V4 connected as canonical project core', OMS.diagnostics());
    return true;
  }

  const connectionTimer = window.setInterval(() => {
    if (connect()) window.clearInterval(connectionTimer);
  }, 100);

  window.setTimeout(() => {
    if (!connected) console.error('[OMS] Editor V4 canonical core did not connect within 10 seconds');
  }, 10000);

  console.log([
    '=================================',
    'OPENMAPSTUDIO V2',
    'PHASE 2B ACTIVE',
    'PHASE 3A SELECT TOOL',
    'Run: OMS.diagnostics()',
    '================================='
  ].join('\n'));
})();
