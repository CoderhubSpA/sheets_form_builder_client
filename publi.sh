FILE=./README.md
if [ -f "$FILE" ]; then
    echo "git pull"
    git pull
    echo "Limpiando (./resources/js/)"
    rm -rf ./resources/js/*
    echo "Listo"
    echo "Publicando nuevo FormBuilder."
    cp ./sheets_form_builder/resources/js/* ./resources/js/*
    echo "Haciendo commit y push"
    git add . && git commit -m "update" && git push
else 
    echo "Parece que no estás en la raíz del proyecto del cliente. No se realizo ninguna accion"
fi