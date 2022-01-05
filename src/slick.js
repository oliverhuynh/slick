let i=0;
export const init = (config) => {
  i++;

  (function ($, Drupal, drupalSettings) {
  let json = config
    .map((select) => (typeof select === 'string' ? { select } : select))
    .map((select) => ({
      ...{
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        customPaging: false,
        dots: true
      },
      ...select
    })).map((select) => {
      // Add my special paging
      if (select.customPaging) {
        select.customPaging = function(_, i) {
          let text = i+1;
          // Ensure first
          if (i === 0) {
            
          }

          // Ignore toofar active
          // Ensure last
          if (_.getDotCount() === i) {
            text = 'Last';
          }

          return $('<button hacked type="button" />').text(text);
        };
      }
      return select;
    }).reduce((o, { select, ...i }) => ({ ...o, ...{ [select]: i } }), {});


    /* ELEMENT: SLICK */
    Drupal.behaviors[`haclaslick_${i}`] = {
      doslick: function (options) {
        const s = options.slidesToShow || 1;
        const r = options.rows || 1;
        const total = s * r;
        // Skip slick if chilren is not enough
        if (this.children().length <= total) {
          return ;
        }
        this.not('.slick-initialized').slick(options);
      },
      attach: function attach(context) {
        const t = this;
        const select = json;

        // My responsive slick
        for (const sl of Object.keys(select)) {
          for (const o of $(context).find(sl).once('sla').toArray()) {
            const { desktop = false, ...selectobj } = select[sl];
            $(window).on('toMobile', () => {
              try {
                if (desktop) {
                  $(o).slick('unslick');
                }
              } catch (e) {}

              t.doslick.bind($(o))(selectobj);
            });
            $(window).on('toWeb', () => {
              try {
                $(o).slick('unslick');
              } catch (e) {}

              if (desktop) {
                t.doslick.bind($(o))({ ...selectobj, ...desktop });
              }
            });
          }
        }
      }
    };
  })(jQuery, Drupal, drupalSettings);
}
