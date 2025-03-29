import ldap
import ldap.filter

def test_ad_connection(ldap_server, ldap_port, ldap_base_dn, username, password):
    """
    Tests an Active Directory connection and user authentication.

    Args:
        ldap_server: The hostname or IP address of the LDAP server.
        ldap_port: The port number of the LDAP server (usually 389 or 636 for LDAPS).
        ldap_base_dn: The base DN for your Active Directory domain.
        username: The username to authenticate with.
        password: The password for the username.

    Returns:
        True if the connection and authentication are successful, False otherwise.
    """
    try:
        ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER) # For testing without proper certs. Remove for production.
        ldap.set_option(ldap.OPT_REFERRALS, 0) # Important for following AD referrals
        l = ldap.initialize(f"ldap://{ldap_server}:{ldap_port}")
        l.protocol_version = 3 # Use LDAP v3
        l.set_option(ldap.OPT_NETWORK_TIMEOUT, 5) # Set a timeout
        l.simple_bind_s(username, password)
        print("AD connection and authentication successful!")
        l.unbind_s() # Important: close the connection.
        return True

    except ldap.SERVER_DOWN as e:
        print(f"Error: LDAP server down: {e}")
        return False
    except ldap.INVALID_CREDENTIALS as e:
        print(f"Error: Invalid credentials: {e}")
        return False
    except ldap.LDAPError as e:
        print(f"Error: LDAP error: {e}")
        return False
    except Exception as e:
        print(f"An unexpected error occured: {e}")
        return False

# Example usage (replace with your actual values)
ldap_server = "Grp-4-AD.tecknet.ca" #example: ad.example.com
ldap_port = 389 # or 636 for LDAPS
ldap_base_dn = "DC=tecknet,DC=ca" #example: DC=example,DC=com
username = "Zara_IT@tecknet.ca" #example: testuser@ad.example.com or your_username
password = "Secret55"

if test_ad_connection(ldap_server, ldap_port, ldap_base_dn, username, password):
    print("User authentication test passed.")
else:
    print("User authentication test failed.")