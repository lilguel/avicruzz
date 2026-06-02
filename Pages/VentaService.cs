using System.Text.Json;
using avicruz.Models;

namespace avicruz.Services
{
    public class VentaService
    {
        private readonly HttpClient _http;

        private const string url =
            "https://script.google.com/macros/s/AKfycbxx9-xJcMAVWQoDHttxWLwTI87fgJiq1Ltiqd93WTSYMF5mDL2rCrnVENq2CgWgxBNYiQ/exec";

        public VentaService(HttpClient http)
        {
            _http = http;
        }

        // =========================
        // OBTENER VENTAS (CLAVE)
        // =========================
        public async Task<List<Venta>> ObtenerVentas()
        {
            try
            {
                Console.WriteLine("🔄 Obteniendo ventas de Google Sheets...");

                var json = await _http.GetStringAsync(url + "?action=ventas");

                Console.WriteLine($"📄 Respuesta recibida: {json.Substring(0, Math.Min(100, json.Length))}");

                var data = JsonSerializer.Deserialize<List<Venta>>(json,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        // Esto permite que si un número viene como "150.00" (texto), C# lo convierta a decimal sin crasear
                        NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
                    });

                Console.WriteLine($"✅ Ventas deserializadas: {data?.Count ?? 0} registros");

                return data ?? new List<Venta>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR ObtenerVentas: {ex.Message}");
                Console.WriteLine($"Stack: {ex.StackTrace}");
                return new List<Venta>();
            }
        }

        // =========================
        // GUARDAR
        // =========================
        public async Task<string> GuardarVenta(Venta v)
        {
            try
            {
                Console.WriteLine($"💾 Guardando venta: {v.tienda} - {v.tipo} x{v.cantidad} @ ${v.precio}");

                var queryUrl = url +
                    "?action=guardar" +
                    $"&fecha={Uri.EscapeDataString(v.fecha)}" +
                    $"&tipo={Uri.EscapeDataString(v.tipo)}" +
                    $"&cantidad={v.cantidad}" +
                    $"&precio={v.precio}" +
                    $"&pagado={Uri.EscapeDataString(v.pagado)}" +
                    $"&tienda={Uri.EscapeDataString(v.tienda)}";

                Console.WriteLine($"🔗 URL: {queryUrl}");

                var res = await _http.GetAsync(queryUrl);
                var resultado = await res.Content.ReadAsStringAsync();

                Console.WriteLine($"📤 Respuesta del servidor: {resultado}");

                return resultado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR GuardarVenta: {ex.Message}");
                return $"ERROR: {ex.Message}";
            }
        }

        // =========================
        // ELIMINAR
        // =========================
        public async Task<string> Eliminar(long id) // <-- Debe recibir 'long', no 'int'
        {
            try
            {
                Console.WriteLine($"🗑️ Eliminando venta ID: {id}");

                var res = await _http.GetAsync(url + "?action=eliminar&id=" + id);
                var resultado = await res.Content.ReadAsStringAsync();

                Console.WriteLine($"📤 Respuesta del servidor: {resultado}");

                return resultado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR Eliminar: {ex.Message}");
                return $"ERROR: {ex.Message}";
            }
        }
        // =========================
        // MARCAR COMO PAGADO
        // =========================
        public async Task<string> MarcarComoPagado(long id)
        {
            try
            {
                Console.WriteLine($"💰 Marcando como pagado la venta ID: {id}");

                // Enviaremos una nueva acción llamada 'marcar_pagado'
                var res = await _http.GetAsync(url + "?action=marcar_pagado&id=" + id);
                var resultado = await res.Content.ReadAsStringAsync();

                Console.WriteLine($"📤 Respuesta del servidor: {resultado}");

                return resultado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ ERROR MarcarComoPagado: {ex.Message}");
                return $"ERROR: {ex.Message}";
            }
        }
    }

}