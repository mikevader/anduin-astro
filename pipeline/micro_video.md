---
status: dump
---

# Surveillance


## Microphone



## Video

with motion:
https://www.technicallywizardry.com/raspberry-pi-security-camera-software/
https://tutorials-raspberrypi.com/raspberry-pi-security-camera-livestream-setup/
https://medium.com/@Cvrsor/how-to-make-a-diy-home-alarm-system-with-a-raspberry-pi-and-a-webcam-2d5a2d61da3d
https://www.instructables.com/Raspberry-Pi-as-low-cost-HD-surveillance-camera/

set target bitrate:
https://github.com/mpromonet/v4l2rtspserver/issues/45

use pi cam in ubuntu:
https://larrylisky.com/2016/11/24/enabling-raspberry-pi-camera-v2-under-ubuntu-mate/

pi cam on pi zero as rtsp stream
https://www.instructables.com/IP-Camera-Using-the-Raspberry-Pi-Zero-Home-Surveil/

setup v4l2 rtsp server:
https://github.com/misterjtc/raspberrypi_security



## Make Settings stick



## Task template

---
- name: Configure Android udev rules
  template:
    src: 51-android.rules.j2
    dest: '/etc/udev/rules.d/51-android.rules'
    mode: '0644'


rules.j2:
{% for rule in android_udev_vendor_ids %}
# {{ rule.name }}
SUBSYSTEM=="usb", ATTR{idVendor}=="{{ rule.id }}", MODE="0666", GROUP="plugdev"

{% endfor %}


## References

https://superuser.com/questions/471597/linux-v4l-webcam-make-settings-stick
https://www.kurokesu.com/main/2016/01/16/manual-usb-camera-settings-in-linux/
https://wiki.archlinux.org/index.php/webcam_setup

https://github.com/0x0I/ansible-role-systemd

