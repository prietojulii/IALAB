import path from 'path'; //nos permite moverme entre direcciones
import { environment } from './environment';
import { createConnection } from "typeorm"; //permite crear una aplicación apartir de
                                            // datos como usuario contraseña, base de datos, etc
export async function connect() { 
    await createConnection({
        type: 'postgres',   //tipo de base de datos
        port: Number(environment.DB_PORT),         //puerto por default de postgres
        username: environment.DB_USERNAME,
        password: environment.DB_PASSWORD,
        database: environment.DB_DATABASE,
        entities: [
            path.join(__dirname,'../entity/**/**.ts'), //dirname indica directorio actual, 
                                                        //y con path.join indico donde moverme
                                                        //(./../entity/%.ts)
        ],
        synchronize: true,
    });

    console.log("database running");
}
/*
CRUD: 
 CREATE
 READ
 UPDATE
 DELETE
*/

/*
Comando para instalar librerias
npm i pg --save
npm install dotenv --save
*/