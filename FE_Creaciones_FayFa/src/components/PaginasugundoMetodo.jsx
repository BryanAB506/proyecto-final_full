import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import '../styles/Segundopaso.css'

export default function PaginaSegundoMetodo() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);


  const [metodo_pago, setMetodo_pago] = useState("")
        const [comprobante_pago, setComprobante_pago] = useState("")
        const [Ordenes_id, setOrdenes_id] = useState("")

        const { logout, setNuevoProducto } = useContext(FayFaContext);

        const cargarMetodo = (e) => {
            setMetodo_pago(e.target.value);
        }

        const cargarComprobante = (e) => {
            setComprobante_pago(e.target.value)
        }

        const cargarOrdenes = (e) => {
            setOrdenes_id(e.target.value);
        }

        const cargarComprobantes_pago= async (e) => {
            e.preventDefault();
            try {
              const Factura = await posComprobantePago(metodo_pago, comprobante_pago, Ordenes_id);
              setNuevoProducto(Factura)
        
              Swal.fire("Comprobante leido con éxito.");
            } catch (error) {
              console.error("Error al agregar el comprobante:", error);
              Swal.fire("Hubo un error al agregar el comprobante");
            }
          };







  return (
    <Container>
      <h4 className="mt-4">Paso 2: Método de Pago</h4>
      <Form>
        {/* Métodos de pago */}
        <Form.Check
          type="radio"
          id="payLocal"
          label="Pagar en el local"
          value="local"
          name="paymentMethod"
          checked={paymentMethod === "local"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <Form.Check
          type="radio"
          id="sinpe"
          label="Pagar por Sinpe Móvil"
          value="sinpe"
          name="paymentMethod"
          checked={paymentMethod === "sinpe"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <Form.Check
          type="radio"
          id="bankTransfer"
          label="Pagar por transferencia bancaria"
          value="transfer"
          name="paymentMethod"
          checked={paymentMethod === "transfer"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />

        {/* Comprobante de pago */}
        {paymentMethod && (
          <div className="mt-3">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Subir comprobante de pago</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setPaymentProof(e.target.files[0])}
              />
            </Form.Group>
          </div>
        )}

        {/* Botón de envío */}
        <Button
          type="submit"
          variant="primary"
          className="mt-3"
          id="botonEnvio"
          onClick={(e) => {
            e.preventDefault();
            // Aquí puedes agregar la lógica para hacer el POST
            console.log("Método de pago:", paymentMethod);
            console.log("Comprobante de pago:", paymentProof);
          }}
        >
          Enviar
        </Button>
      </Form>
    </Container>
  );
}
