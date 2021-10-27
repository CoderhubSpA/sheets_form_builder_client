FILE=./README.md
if [ -f "$FILE" ]; then
    echo "- git pull Form Builder"
    cd ../sheets_form_builder/
    git reset --hard
    git branch
    git pull
    npm run --silent production
    echo "- git pull Form Builder Client"
    cd ../sheets_form_builder_client/
    git branch
    git pull
    echo "- Limpiando"
    rm -rf ./resources/js/Sheets
    rm -rf ./resources/js/store
    echo "- Listo"
    echo "- Publicando nuevo FormBuilder."
    cp -r ../sheets_form_builder/resources/js/Sheets ./resources/js
    cp -r ../sheets_form_builder/resources/js/store ./resources/js
    echo "- Haciendo commit y push"
    git add . && git commit -m "update" && git push
    echo "- git pull en Sheets"
    cd ../sheets
    git branch
    git pull
    echo "- composer update Sheets"
    composer update
    echo "- Publicando Form Builder en Sheets"
    ./publish_form_builder.sh 
    echo "- Ejecutando npm run dev en Sheets"
    npm run dev
    echo "- Subiendo al repo"
    git add . && git commit -m "Form Builder update" && git push
else 
    echo "- Parece que no estás en la raíz del proyecto del cliente. No se realizo ninguna accion"
fi