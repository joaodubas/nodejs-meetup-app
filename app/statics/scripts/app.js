(function (window, document, $, undefined) {
  var $form = $('#app-note-create');
  var $container = $('#app-note-container');
  var $message = $('#app-note-message');

  var Note = window.Note || {};
  Note.list = function list() {
    $.ajax({
      type: 'GET',
      url: '/api/list',
      success: function (data) {
        $container.append(data);
      },
      dataType: 'html'
    });
  };
  Note.create = function create(e) {
    e.preventDefault();
    var formData = $form.serialize();
    $.ajax({
      type: 'POST',
      url: $form.attr('action'),
      data: formData,
      success: function (data) {
        $container.append(data);
        $form.get(0).reset();
      },
      dataType: 'html'
    });
  };
  Note.remove = function remove(e) {
    e.preventDefault();
    var $node = $(this);
    var noteId = $node.attr('data-js-slug');
    $.ajax({
      type: 'DELETE',
      url: '/api/' + noteId + '/delete',
      beforeSend: function (jxhr) {
        jxhr.setRequestHeader('X-CSRF-Token', $node.attr('data-js-csrf'));
      },
      success: function (data) {
        $message.append(data);
        $node.fadeOut(function () {
          $node.parent().parent().remove();
          $form.get(0).reset();
        });
      },
      dataType: 'html'
    });
  };

  $form.on('submit', Note.create);
  $container.on('click', '.close', Note.remove);
  $(document).ready(Note.list);

  window.Note = Note;
})(window, window.document, jQuery);
