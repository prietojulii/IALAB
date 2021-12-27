import { startServer } from './server';
//import { ApolloServer } from 'apollo-server-express' //permite tener disponible graphql

async function main(){
    const port: number = 4000;
    const app = await startServer();
    app.listen(port);
    console.log("app running at ", port);

}


main();

//graftql es como una api rest que tiene un solo endpoint y que solo permite el metodo push(?)
//es como una unica ruta de entrada que apuntaa auna api algo ais (?)
//COn apoloServer permite crear en endpoint (ruta), se encarga solo de la api de graphql