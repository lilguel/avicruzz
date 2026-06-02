using System;
using avicruz.Models;

namespace avicruz.Services
{
    public class EstadoSesion
    {
        private Usuario? _usuarioActual;
        public Usuario? UsuarioActual
        {
            get => _usuarioActual;
            set { _usuarioActual = value; NotifyStateChanged(); }
        }

        // --- NUEVO: La memoria del Zoom (100 = 100%) ---
        private int _nivelZoom = 100;
        public int NivelZoom
        {
            get => _nivelZoom;
            set { _nivelZoom = value; NotifyStateChanged(); }
        }

        public event Action? OnChange;
        private void NotifyStateChanged() => OnChange?.Invoke();
    }
}