using System.Net.Http.Json;
using avicruz.Models;

namespace avicruz.Services
{
    public class AuthService
    {
        private readonly HttpClient _http;

        private const string url =
            "https://script.google.com/macros/s/AKfycbxx9-xJcMAVWQoDHttxWLwTI87fgJiq1Ltiqd93WTSYMF5mDL2rCrnVENq2CgWgxBNYiQ/exec";

        public AuthService(HttpClient http)
        {
            _http = http;
        }

        // ========================
        // LOGIN
        // ========================
        public async Task<Usuario?> Login(string user, string pass)
        {
            var usuarios = await ObtenerUsuarios();
            return usuarios?.FirstOrDefault(u =>
                u.usuario == user &&
                u.password.ToString() == pass);
        }

        // ========================
        // OBTENER USUARIOS
        // ========================
        public async Task<List<Usuario>> ObtenerUsuarios()
        {
            try
            {
                Console.WriteLine("🔄 Obteniendo usuarios de Google Sheets...");

                var usuarios = await _http.GetFromJsonAsync<List<Usuario>>(
                    url + "?action=usuarios"
                );

                Console.WriteLine($"✅ Usuarios obtenidos: {usuarios?.Count ?? 0}");
                return usuarios ?? new List<Usuario>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error al obtener usuarios: {ex.Message}");
                return new List<Usuario>();
            }
        }

        // ========================
        // CREAR USUARIO
        // ========================
        public async Task<string> CrearUsuario(string usuario, string password, string rol)
        {
            try
            {
                Console.WriteLine($"💾 Creando usuario: {usuario} - Rol: {rol}");

                var queryUrl = url +
                    "?action=crear_usuario" +
                    $"&usuario={Uri.EscapeDataString(usuario)}" +
                    $"&password={Uri.EscapeDataString(password)}" +
                    $"&rol={Uri.EscapeDataString(rol)}";

                Console.WriteLine($"🔗 URL: {queryUrl}");

                var res = await _http.GetAsync(queryUrl);
                var resultado = await res.Content.ReadAsStringAsync();

                Console.WriteLine($"📤 Respuesta: {resultado}");
                return resultado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error al crear usuario: {ex.Message}");
                return $"ERROR: {ex.Message}";
            }
        }

        // ========================
        // ELIMINAR USUARIO
        // ========================
        public async Task<string> EliminarUsuario(int id)
        {
            try
            {
                Console.WriteLine($"🗑️ Eliminando usuario ID: {id}");

                var queryUrl = url + "?action=eliminar_usuario&id=" + id;
                Console.WriteLine($"🔗 URL: {queryUrl}");

                var res = await _http.GetAsync(queryUrl);
                var resultado = await res.Content.ReadAsStringAsync();

                Console.WriteLine($"📤 Respuesta: {resultado}");
                return resultado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error al eliminar usuario: {ex.Message}");
                return $"ERROR: {ex.Message}";
            }
        }
    }
}