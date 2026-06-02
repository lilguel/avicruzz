namespace avicruz.Models
{
    public class Venta
    {
        public long id { get; set; }
        public string fecha { get; set; } = string.Empty;
        public string tipo { get; set; } = string.Empty;
        public int cantidad { get; set; }
        public decimal precio { get; set; }
        public decimal total { get; set; }
        public string pagado { get; set; } = "NO";
        public string tienda { get; set; } = "Tienda 1";
    }
}