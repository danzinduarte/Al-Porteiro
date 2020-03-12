using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Porteiro
    {
        public int Id { get; set; }

        [ForeignKey("usuario")]
        public int Usuario_Id { get; set; }
        public virtual Usuario usuario { get; set; }
        
        [ForeignKey("pessoa")]
        public int Pessoa_Id { get; set; }
        public virtual Pessoa pessoa { get; set; }
    }
}