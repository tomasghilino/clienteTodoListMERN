import React, { useReducer } from 'react';
import TareaContext from './tareaContext';
import TareaReducer from './tareaReducer';
import clienteAxios from '../../config/axios';

import {
  AGREGAR_TAREA,
  ELIMINAR_TAREA,
  TAREAS_PROYECTO,
  VALIDAR_TAREA,
  TAREA_ACTUAL,
  ACTUALIZAR_TAREA,
  LIMPIAR_TAREA,
} from '../../types';

const TareaState = (props) => {
  const initialState = {
    tareasproyecto: [],
    errortarea: false,
    tareaseleccionada: null,
  };

  // Crear dispatch
  const [state, dispatch] = useReducer(TareaReducer, initialState);

  // Crear las funciones

  // Obtener las tareas de un proyecto
  const obtenerTareas = async (proyecto) => {
    try {
      const resultado = await clienteAxios.get('/api/tareas', {
        params: { proyecto },
      });

      dispatch({
        type: TAREAS_PROYECTO,
        payload: resultado.data.tareas,
      });
    } catch (error) {}
  };

  // Agregar una tarea al proyecto seleccionado
  const agregarTarea = async (tarea) => {
    try {
      const resultado = await clienteAxios.post('/api/tareas', tarea);

      dispatch({
        type: AGREGAR_TAREA,
        payload: resultado.data.tarea,
      });
    } catch (error) {}
  };

  // Valida y muestra un error en caso de que sea neceasrio
  const validarTarea = () => {
    dispatch({
      type: VALIDAR_TAREA,
    });
  };

  // Elimina una tarea
  const eliminarTarea = async (id, proyecto) => {
    try {
      await clienteAxios.delete(`/api/tareas/${id}`, { params: { proyecto } });
      dispatch({
        type: ELIMINAR_TAREA,
        payload: id,
      });
    } catch (error) {}
  };

  // Edita o modifica una tarea
  const actualizarTarea = async (tarea) => {
    try {
      const resultado = await clienteAxios.put(
        `/api/tareas/${tarea._id}`,
        tarea
      );
      dispatch({
        type: ACTUALIZAR_TAREA,
        payload: resultado.data.tarea,
      });
    } catch (error) {}
  };

  //Extrae una tarea para edicion
  const guardarTareaActual = (tarea) => {
    dispatch({
      type: TAREA_ACTUAL,
      payload: tarea,
    });
  };

  // Elimina la tarea seleccionada
  const limpiarTarea = () => {
    dispatch({
      type: LIMPIAR_TAREA,
    });
  };
  return (
    <TareaContext.Provider
      value={{
        tareasproyecto: state.tareasproyecto,
        errortarea: state.errortarea,
        tareaseleccionada: state.tareaseleccionada,
        obtenerTareas,
        agregarTarea,
        validarTarea,
        eliminarTarea,
        guardarTareaActual,
        actualizarTarea,
        limpiarTarea,
      }}
    >
      {props.children}
    </TareaContext.Provider>
  );
};

export default TareaState;
