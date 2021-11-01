const mails = [
  {
    'id': '15453ba60d3baa5daaf',
    'from': {
      'name': 'Domnic Harris',
      'avatar': "https://via.placeholder.com/150",
      'email': 'domnicharris@example.com'
    },
    'to': [
      {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }, {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }
    ],
    'subject': 'Fusce a libero pellentesque',
    'message': 'Maecenas sem arcu, scelerisque in odio vel, porttitor dignissim purus. Sed vehicula commodo porta. Etiam nec dictum mauris. Ut imperdiet maximus orci vitae ornare. Nullam et libero sit amet tellus ultricies rutrum et sit amet nisl. Pellentesque condimentum diam sed hendrerit facilisis. Suspendisse bibendum convallis quam, sit amet rutrum nisi pulvinar et. Nunc placerat, diam at scelerisque viverra, mi velit auctor nibh, at rhoncus erat ex vitae felis. Integer sed ante eget est rutrum ultrices ut non ipsum.',
    'read': true,
    'starred': false,
    'important': false,
    'hasAttachments': false,
    'labels': [
      3,
      2
    ],
    'selected': false,
    'folder': 0
  },
  {
    'id': '15453a06c08fb021776',
    'from': {
      'name': 'Garry Sobars',
      'avatar': "https://via.placeholder.com/150",
      'email': 'danielleobrien@example.com'
    },
    'to': [
      {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }
    ],
    'subject': 'Nullam id ex at augue pharetra vestibulum eget id mauris.',
    'message': 'Cras bibendum tortor tortor, eu luctus risus gravida ut. Suspendisse nisi tortor, consequat at pellentesque quis, dapibus vel risus. Praesent aliquam sit amet diam quis luctus. Nulla facilisi. Maecenas id molestie tortor. Nulla eget pretium nulla. Etiam consequat dictum velit, at egestas lacus laoreet ac. Ut facilisis massa vel mi fringilla, non blandit eros dictum. Integer in tellus vitae nisi tincidunt pulvinar. Maecenas ac ante ut felis feugiat ornare id a quam. Quisque feugiat ante quis ornare placerat.',
    'time': '4 Dec',
    'read': true,
    'starred': true,
    'important': false,
    'hasAttachments': false,
    'labels': [
      1,
      3
    ],
    'selected': false,
    'folder': 0
  },
  {
    'id': '1541ca7af66da284177',
    'from': {
      'name': 'Stella Brown',
      'avatar': '',
      'email': 'stellgrown@example.com'
    },
    'to': [
      {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }
    ],
    'subject': 'Vivamus venenatis tempus ipsum, id finibus libero aliquet convallis.',
    'message': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lorem diam, pulvinar id nisl non, ultrices maximus nibh. Suspendisse ut justo velit. Nullam ac ultrices risus, quis auctor orci. Vestibulum volutpat nisi et neque porta ullamcorper. Maecenas porttitor porta erat ac suscipit. Sed cursus leo ut elementum fringilla. Maecenas semper viverra erat, vel ullamcorper dui efficitur in. Vestibulum placerat imperdiet tellus, et tincidunt eros posuere eget. Proin sit amet facilisis libero. Nulla eget est ut erat aliquet rhoncus. Quisque ac urna vitae dui hendrerit sollicitudin vel id sem.  In eget ante sapien. Quisque consequat velit non ante finibus, vel placerat erat ultricies. Aliquam bibendum justo erat, ultrices vehicula dolor elementum a. Mauris eu nisl feugiat ligula molestie eleifend.\n Aliquam efficitur venenatis velit ac porta. Vivamus vitae pulvinar tellus. Donec odio enim, auctor eget nibh mattis, ultricies dignissim lacus. Phasellus non tincidunt dui. Nulla eu arcu lorem.  Donec non hendrerit augue, lobortis sollicitudin odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sit amet euismod enim, eget vestibulum justo. Fusce a placerat lectus, eget feugiat purus. Cras risus ante, faucibus eget justo commodo, volutpat tempor ante. Donec sit amet leo venenatis, gravida quam sit amet, blandit dui. In quam ante, elementum ut faucibus nec, tristique vitae dui.  \n \n Praesent vel erat at enim placerat luctus vel ut ipsum. In congue tempor mi, non ornare lectus condimentum at. Aenean libero diam, finibus eget sapien et, tristique fermentum lorem.  ',
    'time': '3 Dec',
    'read': true,
    'starred': false,
    'important': false,
    'hasAttachments': false,
    'labels': [],
    'selected': false,
    'folder': 0
  },
  {
    'id': '154297167e781781745',
    'from': {
      'name': 'Steve Jonson',
      'avatar': '',
      'email': 'stevejonson@example.com'
    },
    'to': [
      {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }
    ],
    'subject': 'Donec ut ante tristique, gravida justo vitae',
    'message': 'dictum at ligula vitae, posuere sagittis augue. Nam vitae eros quis felis consectetur egestas vitae vitae massa. Vestibulum tincidunt nisi neque, eu ullamcorper risus aliquet vel. Nunc ut lorem dapibus, interdum nulla vel, euismod elit. Fusce a mollis erat, non egestas dui. Fusce eu rutrum orci. Aliquam hendrerit metus sit amet interdum iaculis. Morbi eget nibh ut nibh convallis fermentum vitae ac mauris. Phasellus ligula purus, eleifend vel massa ut, interdum pulvinar sapien. Nullam a ex nec elit condimentum mattis. Nullam sit amet dictum neque, vel sagittis eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ',
    'time': '3 Dec',
    'read': true,
    'starred': false,
    'important': false,
    'hasAttachments': false,
    'labels': [],
    'selected': false,
    'folder': 0
  },
  {
    'id': '15427f4c1b7f3953234',
    'from': {
      'name': 'Ira Shorter',
      'avatar': '',
      'email': 'irashorter@example.com'
    },
    'to': [
      {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }
    ],
    'subject': 'Commits that need to be pushed lorem ipsum dolor sit amet',
    'message': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lorem diam, pulvinar id nisl non, ultrices maximus nibh. Suspendisse ut justo velit. Nullam ac ultrices risus, quis auctor orci. Vestibulum volutpat nisi et neque porta ullamcorper. Maecenas porttitor porta erat ac suscipit. Sed cursus leo ut elementum fringilla. Maecenas semper viverra erat, vel ullamcorper dui efficitur in. Vestibulum placerat imperdiet tellus, et tincidunt eros posuere eget. Proin sit amet facilisis libero. Nulla eget est ut erat aliquet rhoncus. Quisque ac urna vitae dui hendrerit sollicitudin vel id sem.  In eget ante sapien. Quisque consequat velit non ante finibus, vel placerat erat ultricies. Aliquam bibendum justo erat, ultrices vehicula dolor elementum a. Mauris eu nisl feugiat ligula molestie eleifend.\n Aliquam efficitur venenatis velit ac porta. Vivamus vitae pulvinar tellus. Donec odio enim, auctor eget nibh mattis, ultricies dignissim lacus. Phasellus non tincidunt dui. Nulla eu arcu lorem.  Donec non hendrerit augue, lobortis sollicitudin odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sit amet euismod enim, eget vestibulum justo. Fusce a placerat lectus, eget feugiat purus. Cras risus ante, faucibus eget justo commodo, volutpat tempor ante. Donec sit amet leo venenatis, gravida quam sit amet, blandit dui. In quam ante, elementum ut faucibus nec, tristique vitae dui.  \n \n Praesent vel erat at enim placerat luctus vel ut ipsum. In congue tempor mi, non ornare lectus condimentum at. Aenean libero diam, finibus eget sapien et, tristique fermentum lorem.  ',
    'time': '2 Dec',
    'read': true,
    'starred': false,
    'important': false,
    'hasAttachments': false,
    'labels': [],
    'selected': false,
    'folder': 3
  },
  {
    'id': '15459251a6d6b397565',
    'from': {
      'name': 'Alex Dolgove',
      'avatar': "https://via.placeholder.com/150",
      'email': 'alexdolgove@example.com'
    },
    'to': [
      {
        'name': 'me',
        'email': 'robert.johnson@example.com'
      }
    ],
    'subject': 'Ut tincidunt massa non elementum fermentum..',
    'message': 'Nullam vel ipsum eget odio viverra pellentesque. Nulla auctor eu felis eget vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque quam nisi, pulvinar vitae nulla sed, blandit auctor lacus. Vestibulum et semper lorem. Suspendisse interdum est neque, ut tempus eros ultricies et. Proin ultricies elit ac est egestas pharetra. Praesent id mollis enim. Suspendisse quis arcu nec lacus molestie pharetra sit amet in mauris.',
    'time': '2 Dec',
    'read': false,
    'starred': false,
    'important': true,
    'hasAttachments': true,
    'attachments': [
      {
        'type': 'image',
        'fileName': 'bike',
        'preview': "https://via.placeholder.com/500X333",
        'url': '',
        'size': '1.1Mb'
      },
      {
        'type': 'image',
        'fileName': 'burgers',
        'preview': "https://via.placeholder.com/500X333",
        'url': '',
        'size': '380kb'
      },
      {
        'type': 'image',
        'fileName': 'camera',
        'preview': "https://via.placeholder.com/600X400",
        'url': "https://via.placeholder.com/600X400",
        'size': '17Mb'
      }
    ],
    'labels': [
      1
    ],
    'selected': false,
    'folder': 0
  }
];

export default mails;
