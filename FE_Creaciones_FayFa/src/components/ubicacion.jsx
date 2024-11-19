import React from 'react';

const Mapa = () => {
    return (
        <div className="mapaCont">
            <p className="mapaTexto">
                En Creaciones FayFa, creemos que la moda es más que solo ropa: es una forma de expresión, identidad y confianza. Nuestro viaje comenzó con una visión clara: ofrecer prendas que no solo sigan las tendencias, sino que también reflejen estilo, calidad y autenticidad. Nos apasiona la moda y trabajamos cada día para ofrecer colecciones versátiles y de alta calidad para todo tipo de personas, estilos y ocasiones.
            </p>
            <div className="mapaTitulo">
                <h1>NUESTRA UBICACIÓN</h1>
            </div>
            <div className="mapaIframeCont">
                <iframe
                    src="https://maps.google.com/maps?q=Panaderia%20Riojalandia&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                    className="mapaIframe"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default Mapa;
