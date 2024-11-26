import '../styles/NewWeb.css'



function NewWeb() {

  return (
    <div className="contSobresalir">
        <div className="sobresalir">
            <h1 id='titulo1'>"Que nos hace sobresalir"</h1>
            <p id='texto2'>"La ropa que eliges habla de ti antes de que digas una palabra. Nos destacamos porque ofrecemos más que prendas: ofrecemos estilo, confianza y una forma de expresarte sin límites. Cada pieza que diseñamos está pensada para resaltar lo mejor de ti, combinando calidad, tendencias y detalles únicos. Nuestra misión es que te sientas auténtico y seguro, porque no se trata solo de vestirse, sino de sobresalir en cualquier ocasión. ¡Con nosotros, tu estilo es tu mejor carta de presentación!"</p>
        </div>
        <div className="NWeb">
            <img className="web" src="src\assets\img\nuevaWEB.png" alt="" width={500}/>
        </div>
    </div>
  );
}

export default NewWeb;
