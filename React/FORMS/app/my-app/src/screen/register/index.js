import { React, useState } from "react";
import { Formik , /*useFormik*/} from "formik"; 
//se puede usar el componente Formik o el Hook useFormik, se usa uno o el otro ,
// nunca los dos juntos
import * as Yup from "yup";
import {ContainerInput, Button, ContainerForm } from "./styles";

//los valores inciales de mi formulario, pongo tantos como quiero.
const initialValuesBasic = {
  name: "",
  id: "",
  email: "",
  phone: "",
  password: "",
  repeatPassword: "",
};

//condiciones de validacion de cada campo
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Este campo es obligatorio"),
  id: Yup.number()
    .required("Este campo es obligatorio")
    .typeError("solo acepta numeros")
    .min(30000000, "debe ser mayor a 30000000")
    .max(60000000, "debe ser menor a 60000000"),
  email: Yup.string()
    .email("Este correo electronico es Invalido")
    .required("Este campo es obligatorio"),
  phone: Yup.number(),
  password: Yup.string()
    .required("Este campo es obligatorio")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(/(?=\w*[A-Z])/, "Debe tener una mayuscula"), //puedo usar Regex
  repeatPassword: Yup.string()
    .required("Este campo es obligatorio")
    .oneOf([Yup.ref("password")], "Las constraseñas no coinciden"),
});

const Register = () => {
  const [visiblePassword, setVisiblePassword] = useState(false); //Este es un hook de la variable de estado "visiblePassword"
  return (
    <Formik
      initialValues={initialValuesBasic}
      validationSchema={RegisterSchema} //activamos la validacion al esquema
      //tipo de validacion:
      validateOnSubmit //me muestra el error recien cuando  toco un boton (ejemplo registrar)
      //validateOnBlur//me muestra el error cuando entro y salgo del box input

      onSubmit = { (values)=> console.log(values)} //cuadno tocamos el boton se ejecuta esta funcion
    >
      {({//estas props vinen de Formik
        values, // estructura equivalente a initialValue
        handleChange, //me muestra el error apenas cuando escribo/Cambio contenido del box
        // handleBlur,
        handleSubmit,
        //estos tres muentran activan todos los errores aunque modifiques un box
        touched, //estructura boleana de los elementos tocados. contiene boleanos que indican si cada elemento de vlues fue tocado o no
        errors, //estructura con errores de los elementos de values.
      }) => (
        // este contenedor aparece solo en submit, al igual que la propiedad en el boton
        <ContainerForm onSubmit={handleSubmit}>
          {/* // INPUTS */} 
          <input
            placeholder="Nombre completo"
            name="name"
            onChange={handleChange("name")} //valida cuando cambia lo que escribo en el box
            // onBlur={handleBlur("name")} //valida cuando termino de escribir en el box
            value={values.name}
          />
          {touched.name && errors.name && <p>{errors.name}</p>}

          <input
            placeholder="Numero de documento"
            name="id"
            onChange={handleChange("id")}
            // onBlur={handleBlur("id")}
            value={values.id}
          />
          {touched.id && errors.id && <p>{errors.id}</p>}

          <input
            placeholder="Numero de telefono"
            name="phone"
            onChange={handleChange("phone")}
            // onBlur={handleBlur("phone")}
            value={values.phone}
          />
          {touched.phone && errors.phone && <p>{errors.phone}</p>}

          <input
            placeholder="Correo electronico"
            name="email"
            onChange={handleChange("email")}
            // onBlur={handleBlur("email")}
            value={values.email}
          />
          {touched.email && errors.email && <p>{errors.email}</p>}

          <input
            placeholder="Ingrese una contraseña"
            name="password"
            onChange={handleChange("password")}
            // onBlur={handleBlur("password")}
            value={values.password}
            type={visiblePassword ? "text" : "password"}
          />
          {touched.password && errors.password && <p>{errors.password}</p>}

          <input
            placeholder="Repite una contraseña"
            name="repeatPassword"
            onChange={handleChange("repeatPassword")}
            // onBlur={handleBlur("repeatPassword")}
            value={values.repeatPassword}
            type={visiblePassword ? "text" : "password"}
          />
          {touched.repeatPassword && errors.repeatPassword && (
            <p>{errors.repeatPassword}</p>
          )}

          {/* BOTONES */}
          <Button
            onClick={() => {
              setVisiblePassword(!visiblePassword);
            }}
          >
            {visiblePassword ? "ocultar contraseña" : "Mostrar contraseña"}
          </Button>
          <Button type="submit">Registrarme</Button>
        </ContainerForm>
      )}
    </Formik>
  );
};

export default Register;
